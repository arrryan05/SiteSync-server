import { fetchPageSpeedInsights } from './pagespeed.service';
import { analyzeWithGemini } from './gemini.service';

export async function analyzeWebsite(url: string): Promise<string> {
  try {
    const performanceData = await fetchPageSpeedInsights(url);

    const prompt = `
      Analyze the website: ${url}.
      Here is its PageSpeed Insights JSON. Please summarize the performance, highlight any key issues, and provide suggestions.

      Performance Report:
      ${JSON.stringify(performanceData, null, 2)}
    `;

    return await analyzeWithGemini(prompt);
  } catch (error) {
    console.error('AnalyzeWebsite Error:', error);
    throw error;
  }
}
