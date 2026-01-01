const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());

// 1. UPDATED CORS: Explicitly allow your frontend
app.use(cors({
    origin: 'https://designpro-l827.onrender.com'
}));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. HEALTH CHECK: Open this in your browser to see if server is alive
app.get('/', (req, res) => {
    res.send("DesignPRO Backend is Running! 🚀");
});

// THE BUSINESS BRAIN
const SYSTEM_INSTRUCTION = "You are the official AI Brand Architect for DesignPRO. Anderson is the lead architect. We offer Graphic Design, Billboards, Web/App Dev, and Motion Graphics. Be professional and futuristic.";

// YOUR ROUTE IS HERE
app.post('/api/chat', async (req, res) => {
    try {
        // 3. FLEXIBLE INPUT: Checks for both 'prompt' or 'message' from frontend
        const userInput = req.body.prompt || req.body.message;

        if (!userInput) {
            return res.status(400).json({ error: "No message received from frontend." });
        }

        // 4. BETTER SYSTEM INSTRUCTION SETUP
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const result = await model.generateContent(userInput);
        const response = await result.response;
        const text = response.text();
        
        console.log("AI Replied:", text); // This helps you see it in Render Logs
        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ 
            error: "The DesignPRO neural link encountered a model sync error.",
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 DesignPRO Backend active on port ${PORT}`));