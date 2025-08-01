const axios = require("axios");
require("dotenv").config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = "AIzaSyDYbiGunPOUy_ILrpApc5cSXk6KinAyjxY"


async function generateGeminiResponse(userText) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userText }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    return "Error fetching response from Gemini.";
  }
}

module.exports = { generateGeminiResponse };
