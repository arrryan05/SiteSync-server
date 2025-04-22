// src/prompts/geminiAnalysisPrompt.ts

export function createGeminiPrompt(route: string, trimmedData: any): string {
  return `
  You are an expert website performance analyst. Analyze the following PageSpeed Insights data for the webpage "${route}". 
  Based on the data, provide performance metrics and actionable recommendations for the following metrics:
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - Total Blocking Time (TBT)

  **IMPORTANT:** Return **only** a JSON object no Markdown code fences, no explanatory text, no trailing whitespace.

  
  Please output a single JSON object with the exact structure below (do not include any extra text):
  
  {
    "route": string,
    "performanceData": [
      {
        "FCP": {
           "value": string,
           "recommendedSteps": string[]
        },
        "LCP": {
           "value": string,
           "recommendedSteps": string[]
        },
        "CLS": {
           "value": string,
           "recommendedSteps": string[]
        },
        "TBT": {
           "value": string,
           "recommendedSteps": string[]
        }
      }
    ]
  }
  
  Here is the trimmed PageSpeed Insights data:
  ${JSON.stringify(trimmedData, null, 2)}
  `;
}
