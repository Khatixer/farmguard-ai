
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_API_KEY } from "../config";

/**
 * Declare process for TypeScript to recognize the environment variable 
 * mandated by the platform requirements.
 */
declare var process: {
  env: {
    API_KEY: string;
  };
};

export const diagnosePlant = async (imageDataBase64: string) => {
  try {
    // Priority: 1. Local config file (if provided) 2. Environment variable (standard injection)
    const apiKey = (typeof GEMINI_API_KEY !== 'undefined') 
      ? GEMINI_API_KEY 
      : process.env.API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is missing. Please add it to config.ts or ensure process.env.API_KEY is set.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataBase64.split(',')[1],
            },
          },
          {
            text: "Analyze this image. 1. Determine if it is a plant (isPlant: true/false). 2. If it is a plant, identify it and any disease. If no disease, state 'Healthy'. 3. If it is NOT a plant, set plantName to 'Unknown' and disease to 'None'. 4. Provide a confidence score (0-1). 5. Suggest an organic remedy category: 'baking-soda-spray', 'neem-oil-mix', 'garlic-chili-spray' or 'none'.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isPlant: { type: Type.BOOLEAN },
            plantName: { type: Type.STRING },
            disease: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            remedyId: { type: Type.STRING },
          },
          required: ["isPlant", "plantName", "disease", "confidence", "remedyId"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI model returned an empty response.");
    }

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Diagnosis Error:", error);
    throw error;
  }
};
