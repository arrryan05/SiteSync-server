import { GoogleGenAI, Schema, Type } from "@google/genai";
import { config } from "../config";

const genAI = new GoogleGenAI({ apiKey: config.geminiApiKey! });

export async function analyzeWithGemini(prompt: string): Promise<string> {
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      route: { type: Type.STRING }, 
      performanceData: {
        type: Type.ARRAY,
        minItems: "1",
        maxItems: "1",

        items: {
          type: Type.OBJECT,
          properties: {
            FCP: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                recommendedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["value", "recommendedSteps"],
            },
            LCP: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                recommendedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["value", "recommendedSteps"],
            },
            CLS: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                recommendedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["value", "recommendedSteps"],
            },
            TBT: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                recommendedSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["value", "recommendedSteps"],
            },
          },
          required: ["FCP", "LCP", "CLS", "TBT"],
        },
      },
    },
    required: ["route", "performanceData"],
  };

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    return response.text ?? "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate analysis");
  }
}
