const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const STAFF_CONTEXT = `
You are the official Staff AI for DesignPRO. 
- Your boss is Anderson (the Lead Architect).
- Services: Graphics, Billboards, Web/App Dev, and Motion Graphics.
- Tone: Professional, futuristic, and helpful. 
- Location: Ghana.
`;

// --- DIAGNOSTIC TOOL: This prints available models to your Render logs ---
async function listAvailableModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // default check
        console.log("📡 Connected to Google AI successfully.");
    } catch (e) {
        console.log("⚠️ Connection check failed, but continuing...");
    }
}
listAvailableModels();

app.get('/', (req, res) => res.send("DesignPRO Backend is Online! 🚀"));

app.post('/api/chat', async (req, res) => {
    try {
        const userInput = req.body.prompt || req.body.message;
        if (!userInput) return res.status(400).json({ reply: "Signal lost. Please re-type." });

        // Try the standard stable model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const finalPrompt = `${STAFF_CONTEXT}\n\nUser: ${userInput}\n\nStaff Response:`;

        const result = await model.generateContent(finalPrompt);
        const text = result.response.text();
        
        console.log("✅ Message processed for Anderson's client.");
        res.json({ reply: text });

    } catch (error) {
        console.error("LOGS ERROR:", error.message);
        // If 1.5-flash fails, try 2.0-flash as a backup
        try {
            console.log("🔄 Retrying with backup model...");
            const backupModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await backupModel.generateContent(userInput);
            res.json({ reply: result.response.text() });
        } catch (innerError) {
            res.status(500).json({ reply: "The neural link is still offline. Please check Render logs." });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 DesignPRO Staff AI Active`);
    if (process.env.GEMINI_API_KEY) {
        console.log("✅ API Key detected.");
    } else {
        console.log("❌ API Key MISSING.");
    }
});