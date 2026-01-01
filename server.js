const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Google Generative AI
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

        // NO 'systemInstruction' here - this keeps us on the STABLE API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // We combine context and user input into one string
        const finalPrompt = `${STAFF_CONTEXT}\n\nUser asked: ${userInput}\n\nStaff Response:`;

        const result = await model.generateContent(finalPrompt);
        const text = result.response.text();
        
        console.log("AI Answered Anderson's client!");
        res.json({ reply: text });

    } catch (error) {
        console.error("LOGS ERROR:", error.message);
        res.status(500).json({ reply: "The neural link is experiencing heavy traffic. Please try one more time!" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 DesignPRO Staff AI Active`));