const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- THE BUSINESS BRAIN (System Instructions) ---
const SYSTEM_INSTRUCTION = `
You are the official AI Brand Architect for DesignPRO. 
Your goal is to help potential clients understand our services and convince them to start a project with us.

LEAD ARCHITECT:
- Anderson is the founder and lead architect. He bridges abstract art with business ROI.

OUR CORE SERVICES:
1. Visual Identity: Logo systems, brand guides, and professional stationery.
2. Large Format: Billboards and street ads designed for massive scale and 24/7 visibility.
3. Digital Systems: High-performance React websites and mobile apps.
4. Animated Visuals: 60FPS motion graphics and cinematic video editing.

PRICING & PHILOSOPHY:
- We don't miss deadlines.
- Every project includes 3 rounds of revisions.
- We operate globally (Lagos, NYC, London, Tokyo).
- For specific pricing, tell the user that "Anderson provides custom quotes based on mission parameters."

CALL TO ACTION:
- If a user is interested, tell them to click the "Establish Uplink" button on the Connect page or message Anderson directly on WhatsApp at +233 530 384 997.

TONE:
- Professional, futuristic, high-tech, and confident. Use words like "Protocol," "Uplink," "Parameters," and "Architecture." Keep responses concise.
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // We pass the System Instruction here so the AI always follows it
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
        res.status(500).json({ error: "The DesignPRO neural link is temporarily offline." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 DesignPRO Backend active on port ${PORT}`));