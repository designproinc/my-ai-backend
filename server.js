const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => res.send("DesignPRO Backend is Running! 🚀"));

app.post('/api/chat', async (req, res) => {
    try {
        const userInput = req.body.prompt || req.body.message;
        console.log("Processing message for Anderson...");

        // SWITCHING TO 'gemini-pro' - It is the most stable model 
        // and works perfectly with the instructions we want.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const staffPrompt = `You are the Lead Brand AI for DesignPRO. Anderson is your boss. Use a professional, futuristic tone. \n\nUser Question: ${userInput}`;

        const result = await model.generateContent(staffPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("AI Error:", error.message);
        // If gemini-pro fails, we try a secondary backup name
        res.status(500).json({ reply: "Connection interference. Anderson's neural link is busy. Please try one more time." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 DesignPRO Staff AI Active`));