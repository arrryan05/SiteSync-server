import { fetchPageSpeedInsights } from "./pagespeed.service";
import { analyzeWithGemini } from "./gemini.service";
import { extractAllRoutes } from "./route-extractor.service";
import { runWithConcurrency } from "../utils/ratelimit.util";
import extractRelevantPageSpeedData from "../utils/extractPageSpeedData.util";

// export async function analyzeWebsite(url: string): Promise<string> {
//   try {

//     const routes = await extractAllRoutes(url);
//     console.log('Extracted Routes:');
//     routes.forEach(route => console.log(route));
//     const performanceData = await fetchPageSpeedInsights(url);

//     const prompt = `
//       Analyze the website: ${url}.
//       Here is its PageSpeed Insights JSON. Please summarize the performance, highlight any key issues, and provide suggestions.

//       Performance Report:
//       ${JSON.stringify(performanceData, null, 2)}
//     `;

//     return await analyzeWithGemini(prompt);
//   } catch (error) {
//     console.error('AnalyzeWebsite Error:', error);
//     throw error;
//   }
// }

export async function analyzeWebsite(url: string): Promise<string> {
  try {
    const routes = await extractAllRoutes(url);
    console.log("Extracted Routes:", routes);

    const pageDataArray = await runWithConcurrency(
      routes,
      2,
      async (route) => ({
        route,
        performance: await fetchPageSpeedInsights(route),
      })
    );

    // Analyze each using Gemini (limit concurrency to 2)
    const geminiResponses = await runWithConcurrency(
      pageDataArray,
      2,
      async ({ route, performance }) => {
        const trimmedData = extractRelevantPageSpeedData(performance);
        const prompt = `
        Analyze the page: ${route}.
        Here is its PageSpeed Insights JSON. Summarize performance, highlight issues, and give suggestions.
        \n\nPerformance Report:\n${JSON.stringify(trimmedData, null, 2)}
      `;
        const summary = await analyzeWithGemini(prompt);
        return `---\n🧠 **Insights for ${route}**\n${summary}`;
      }
    );

    return geminiResponses.join("\n\n");
  } catch (error) {
    console.error("AnalyzeWebsite Error:", error);
    throw error;
  }
}
