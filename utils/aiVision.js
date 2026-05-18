const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

const analyzeImageWithGemini = async (imagePath, mimeType) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-2.5-flash as it is recommended for text-and-image tasks.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this image in detail. Return ONLY a valid JSON object with the following structure (no markdown, no backticks, just the JSON):
{
  "title": "A short, descriptive title",
  "aiDescription": "A detailed 2-3 sentence description of what is in the image",
  "detectedObjects": ["object1", "object2", "object3"],
  "category": "One specific broad category (e.g. 'Food', 'Nature', 'Gadget', 'Animal')",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "confidence": "High" (or "Medium" or "Low")
}`;

    const imagePart = fileToGenerativePart(imagePath, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting in response
    if (text.startsWith("\`\`\`json")) {
        text = text.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    throw new Error("Failed to analyze image with AI.");
  }
};

module.exports = { analyzeImageWithGemini };
