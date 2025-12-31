const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- THE BUSINESS BRAIN ---
const SYSTEM_INSTRUCTION = `
You are the official AI Brand Architect for DesignPRO. 
Your goal is to help potential clients understand our services.
Anderson is the founder and lead architect.
We offer: Visual Identity, Large Format/Billboards, Digital Systems (Web/Apps), and Motion Graphics.
Tone: Professional, futuristic, and helpful.
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        // Use the model with instructions
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION 
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ reply: text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "System logic error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend active on port ${PORT}`));