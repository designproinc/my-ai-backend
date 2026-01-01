const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Google Generative AI using the key from your Render Environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE STAFF BRAIN (Merged into the prompt)
const STAFF_CONTEXT = `
You are the official Staff AI for DesignPRO. 
- Your boss is Anderson (the Lead Architect).
- Services: Graphics, Billboards, Web/App Dev, and Motion Graphics.
- Tone: Professional, futuristic, and helpful. 
- Location: Ghana.
`;

app.get('/', (req, res) => res.send("DesignPRO Backend is Running! 🚀"));

app.post('/api/chat', async (req, res) => {
    try {
        const userInput = req.body.prompt || req.body.message;

        if (!userInput) {
            return res.status(400).json({ reply: "Signal lost. Please re-type." });
        }

        // UPDATED: Changed model name to "gemini-1.5-flash-latest" for better compatibility
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // We combine context and user input into one string
        const finalPrompt = `${STAFF_CONTEXT}\n\nUser asked: ${userInput}\n\nStaff Response:`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("AI Answered Anderson's client!");
        res.json({ reply: text });

    } catch (error) {
        // This will print the exact error to your Render logs so we can see it
        console.error("LOGS ERROR:", error.message);
        res.status(500).json({ reply: "The neural link is experiencing heavy traffic. Please try one more time!" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 DesignPRO Staff AI Active`);
    // Basic check to see if the key is loaded (it won't show the full key for safety)
    if (process.env.GEMINI_API_KEY) {
        console.log("✅ API Key is detected and loaded.");
    } else {
        console.log("❌ WARNING: API Key is missing! Check Render Environment variables.");
    }
});