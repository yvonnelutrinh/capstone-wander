import { Router } from "express";
import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//helper function to call gemini
const analyzeInsight = async (insight) => {
    try {
        const prompt = `You are a wise wizard, capable of distilling any input, no matter how nonsensical, into a two-sentence proverb. The first sentence should directly address the provided insight, and the second should offer a related, yet distinct, consideration for the inquirer. Your output must *exclusively* be a proverb, and nothing else. Respond to the following input with a proverb: ${insight}`;
        const response = await model.generateContent(prompt);
        const analysis = response.response.text();
        return analysis;
    } catch (err) {
        console.error(`Error: ${err.message}`);
        setError(`Error: ${err.message}`);

    };
}

router.post("/", async (req, res) => {
    try {
        const aiAnalysis = await analyzeInsight(req.body.insight);
        res.json(aiAnalysis).status(200);
    }
    catch (error) {
        res.status(500).send(`Error retrieving insight analysis: ${error.message}`);
    }
})

export default router;
