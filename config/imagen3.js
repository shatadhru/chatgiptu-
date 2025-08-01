const { GoogleGenAI } = require('@google/genai');

// Initialize Vertex AI client
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'zaroo-a68ec',
  location: 'global',
});

const model = 'gemini-2.5-flash-lite';

const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 0.95,
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
  ],
};
    const promptText = "Write a detailed summary about the latest web development trends in 2025.";


async function generateContent() {
  try {
    const req = {
      model,
      contents: [promptText], // you need to fill this with prompt content
      config: generationConfig,
    };

    const streamingResp = await ai.models.generateContentStream(req);

    for await (const chunk of streamingResp) {
      if (chunk.text) {
        process.stdout.write(chunk.text);
      } else {
        process.stdout.write(JSON.stringify(chunk) + '\n');
      }
    }
  } catch (err) {
    // Catch and log any error from the streaming API call
    console.error('Error during content generation:', err.message || err);
    if (err.details) {
      console.error('Details:', err.details);
    }
  }
}

module.exports = generateContent;
