const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize the Google Generative AI with your Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE BUSINESS BRAIN (System Instructions)
const SYSTEM_INSTRUCTION = "You are the official AI Brand Architect for DesignPRO. Anderson is the lead architect. We offer Graphic Design, Billboards, Web/App Dev, and Motion Graphics. Be professional and futuristic.";

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // FIX: Using "gemini-1.5-flash" with the current SDK format
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // We combine the system instruction with the prompt for better compatibility
        const fullPrompt = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${prompt}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "The DesignPRO neural link encountered a model sync error." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 DesignPRO Backend active on port ${PORT}`));