import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

const genAI = new GoogleGenAI({ apiKey: config.geminiApiKey! });

export async function analyzeWithGemini(prompt: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    if (response && response.text) {
        return response.text;
      } else {
        throw new Error('Failed to analyze website');
      }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate analysis');
  }
}
