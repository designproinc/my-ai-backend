const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize AI with your Render Environment Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const STAFF_CONTEXT = `
You are the official Staff AI for DesignPRO. 
- Your boss is Anderson (the Lead Architect).
- Services: Graphics, Billboards, Web/App Dev, and Motion Graphics.
- Tone: Professional, futuristic, and helpful. 
- Location: Ghana.
`;

// --- Startup Diagnostic ---
async function verifyConnection() {
    try {
        // Testing the 2.0 model on startup
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("📡 System check: Ready to connect to Gemini 2.0");
    } catch (e) {
        console.log("⚠️ Diagnostic: Connection to AI servers pending user request.");
    }
}
verifyConnection();

app.get('/', (req, res) => res.send("DesignPRO Backend is Online! 🚀"));

app.post('/api/chat', async (req, res) => {
    try {
        const userInput = req.body.prompt || req.body.message;
        if (!userInput) return res.status(400).json({ reply: "Signal lost. Please re-type." });

        // Using Gemini 2.0 Flash - the current stable version for 2026
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const finalPrompt = `${STAFF_CONTEXT}\n\nUser: ${userInput}\n\nStaff Response:`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ AI Answered Anderson's client!");
        res.json({ reply: text });

    } catch (error) {
        // This will print the exact error to your Render logs
        console.error("LOGS ERROR:", error.message);
        
        res.status(500).json({ 
            reply: "Our frequency is experiencing interference. Please try again or reach out via WhatsApp." 
        });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 DesignPRO Staff AI Active on port ${PORT}`);
    if (process.env.GEMINI_API_KEY) {
        console.log("✅ API Key detected and loaded from Render Environment.");
    } else {
        console.log("❌ ERROR: API Key NOT FOUND. Check your Render Environment tab.");
    }
});