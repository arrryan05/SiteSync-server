// src/prompts/queryDbPrompt.ts

import type { PageSpeedData } from "../types";

/**
 * Build the natural‐language query string for Chroma.
 * 
 * @param route    The URL route (e.g. "/home", "/api/users")
 * @param psiData  The trimmed PageSpeed Insights data
 */
export function buildQueryDbPrompt(
  route: string,
  psiData: PageSpeedData
): string {
  const { metrics, diagnostics, opportunities } = psiData;
  return `
Find the code snippets most relevant to performance on route "${route}".
Performance metrics:
  • First Contentful Paint (FCP): ${metrics.FCP}
  • Largest Contentful Paint (LCP): ${metrics.LCP}
  • Cumulative Layout Shift (CLS): ${metrics.CLS}
  • Total Blocking Time (TBT): ${metrics.TBT}
Diagnostics:
  ${JSON.stringify(diagnostics, null, 2)}
Opportunities:
  ${opportunities.map(o => `- ${o.id} (weight: ${o.score})`).join("\n")}

Return the chunks of code that are likely responsible for these metrics
or could be tuned to improve them.
  `.trim();
}
