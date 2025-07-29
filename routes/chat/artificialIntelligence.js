const express = require("express");
const router = express.Router();

const generateWifePrompt = require("../../prompt/bou");
const jamaiPrompt = require("../../prompt/jamai");
const generateBanglaGfPrompt = require("../../prompt/gf");
const generateFriendlyBanglaAI = require("../../prompt/friendly");

const { generateGeminiResponse } = require("../../config/ai");

const promptMap = {
  friendly : generateFriendlyBanglaAI , 
  bou : generateWifePrompt ,
  jamai : jamaiPrompt,
  girlfriend: generateBanglaGfPrompt,
};

router.post("/ai", async (req, res) => {
  const { text, tone } = req.body;

  if (!text || !tone) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const promptFunction = promptMap[tone];
  if (!promptFunction) {
    return res.status(400).json({ error: "Invalid tone selected." });
  }

  const promptText = promptFunction(text);

  try {
    const aiReply = await generateGeminiResponse(promptText);
    res.status(200).json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed." });
  }
});

module.exports = router;
