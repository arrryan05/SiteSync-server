import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  pageSpeedApiKey: process.env.PAGESPEED_API_KEY,
  chromaUrl:process.env.CHROMA_URL

};