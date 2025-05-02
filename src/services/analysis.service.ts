import { fetchPageSpeedInsights } from "./pagespeed.service";
import { analyzeWithGemini } from "./gemini.service";
import { extractAllRoutes } from "./route-extractor.service";
import { runWithConcurrency } from "../utils/ratelimit.util";
import extractRelevantPageSpeedData from "../utils/extractPageSpeedData.util";
import { createGeminiPrompt } from "../prompts/geminiAnalysisPrompt";
import { analyzeAndStore } from "../code-analyzer";
import { queryTopChunks } from "./vectorSearch.service";
import { CodeChunkResult } from "../code-analyzer/types";

export async function analyzeWebsite(
  url: string,
  name:string,
  gitRepoUrl?: string,
): Promise<string> {
  try {
    if (gitRepoUrl) {
      await analyzeAndStore(gitRepoUrl,name);
    }

    // 1. Extract all routes for the given website.
    const routes = await extractAllRoutes(url);
    console.log("Extracted Routes:", routes);

    // 2. For each route, fetch performance data concurrently.
    const pageDataArray = await runWithConcurrency(
      routes,
      2,
      async (route) => ({
        route,
        performance: await fetchPageSpeedInsights(route),
      })
    );

    const geminiResponses = await runWithConcurrency(
      pageDataArray,
      2,
      async (data) => {
        if (!data) return null;
        const { route, performance } = data;
        const trimmedData = extractRelevantPageSpeedData(performance);
        console.log("trimmed data", trimmedData);

        let topChunks: CodeChunkResult[] = [];
        if (gitRepoUrl) {
          topChunks = await queryTopChunks(route, trimmedData, "sitesync", 5);
        }
        const prompt = createGeminiPrompt(route, trimmedData, topChunks);

        let response = await analyzeWithGemini(prompt);
        console.log("Raw Gemini response for", route, ":", response);

        const firstBrace = response.indexOf("{");
        const lastBrace = response.lastIndexOf("}");

        let jsonString: string;
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonString = response.slice(firstBrace, lastBrace + 1);
          console.log(jsonString);
        } else {
          // Fallback to the raw response
          jsonString = response;
        }

        // Attempt to parse the sanitized response.
        try {
          const parsed = JSON.parse(jsonString);
          // Ensure the route is correct.
          parsed.route = route;
          return parsed;
        } catch (parseError) {
          console.error(
            `Failed to parse Gemini response for route ${route}:`,
            parseError
          );
          return {
            route,
            performanceData: [
              {
                FCP: { value: "N/A", recommendedSteps: ["Unable to analyze"] },
                LCP: { value: "N/A", recommendedSteps: ["Unable to analyze"] },
                CLS: { value: "N/A", recommendedSteps: ["Unable to analyze"] },
                TBT: { value: "N/A", recommendedSteps: ["Unable to analyze"] },
              },
            ],
          };
        }
      }
    );

    // Return the aggregated results as a formatted JSON string.
    return JSON.stringify(geminiResponses, null, 2);
  } catch (error) {
    console.error("AnalyzeWebsite Error:", error);
    throw error;
  }
}
