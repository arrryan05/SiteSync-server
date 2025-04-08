import { fetchPageSpeedInsights } from './pagespeed.service';
import { analyzeWithGemini } from './gemini.service';
import { extractAllRoutes } from './route-extractor.service';
import { runWithConcurrency } from '../utils/ratelimit.util';


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


export async function analyzeWebsite(domain: string): Promise<string> {
  try {
    const routes = await extractAllRoutes(domain);
    console.log('Extracted Routes:');
    routes.forEach(route => console.log(route));

    const tasks = routes.map(route => async () => {
      const performanceData = await fetchPageSpeedInsights(route);

      const prompt = `
Page: ${route}
-------------------------------
Performance Metrics:
${JSON.stringify(performanceData.lighthouseResult?.audits, null, 2)}

Please provide a summary of performance issues and optimization recommendations.
      `;

      const geminiResponse = await analyzeWithGemini(prompt);
      return `=== Analysis for ${route} ===\n${geminiResponse}\n==============================\n`;
    });

    const results = await runWithConcurrency(tasks, 2); // Limit concurrency to 2
    return results.join('\n');
  } catch (error) {
    console.error('AnalyzeWebsite Error:', error);
    throw error;
  }
}
