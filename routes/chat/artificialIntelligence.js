const express = require("express");
const router = express.Router();

const generateWifePrompt = require("../../prompt/bou");
const jamaiPrompt = require("../../prompt/jamai");
const generateBanglaGfPrompt = require("../../prompt/gf");
const generateFriendlyBanglaAI = require("../../prompt/friendly");

const { generateGeminiResponse } = require("../../config/ai");
const generateFormalExpertPrompt = require("../../prompt/formal");
const generateMeawPrompt = require("../../prompt/bilai");
const generateHimuPrompt = require("../../prompt/himu");

const promptMap = {
  friendly: generateFriendlyBanglaAI,
  bou: generateWifePrompt,
  jamai: jamaiPrompt,
  girlfriend: generateBanglaGfPrompt,
  formal: generateFormalExpertPrompt,
  bilai : generateMeawPrompt,
  himu: generateHimuPrompt
};

const MAX_HISTORY = 6;
router.post("/ai", async (req, res) => {
  const { text, tone, userId } = req.body;

  if (!text || !tone || !userId) {
    return res.status(400).json({ error: "Missing text / tone / userId" });
  }

  const promptFunction = promptMap[tone];
  if (!promptFunction) {
    return res.status(400).json({ error: "Invalid tone selected." });
  }

  const sessionStore = req.app.locals.sessionStore;

  // Initialize nested session history per user & tone
  if (!sessionStore[userId]) sessionStore[userId] = {};
  if (!sessionStore[userId][tone]) sessionStore[userId][tone] = [];

  // Add current user message to tone-specific history
  sessionStore[userId][tone].push({ role: "user", text });

  // Trim history size per tone
  if (sessionStore[userId][tone].length > MAX_HISTORY) {
    sessionStore[userId][tone] = sessionStore[userId][tone].slice(-MAX_HISTORY);
  }

  // Only last 2 messages (user + AI) of this tone
  const recentHistory = sessionStore[userId][tone].slice(-2);

  const historyText = recentHistory
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.text}`)
    .join("\n");

  const promptText = promptFunction(historyText);

  try {
    const aiReply = await generateGeminiResponse(promptText);

    // Save AI reply to tone-specific history
    sessionStore[userId][tone].push({ role: "ai", text: aiReply });

    res.status(200).json({ reply: aiReply });
  } catch (err) {
    console.error("AI processing error:", err);
    res.status(500).json({ error: "ভাতিজা একটু সমস্যা হইসে মনে হয় , শিগ্রই ঠিক হই যাবে !!! " });
  }
});

module.exports = router;
