// src/prompts/geminiAnalysisPrompt.ts

import type { CodeChunkResult } from "../code-analyzer/types";
import type { PageSpeedData }    from "../types";


export function createGeminiPrompt(
  route: string,
  trimmedData: PageSpeedData,
  topChunks: CodeChunkResult[]
): string {
  // 1️⃣ Serialize the trimmed PSI data
  const psiSection = JSON.stringify(trimmedData, null, 2);

  // 2️⃣ Serialize each chunk with file path & line numbers + snippet
  const chunksSection = topChunks
    .map((chunk, idx) => {
      const meta      = chunk.metadata as any;
      const startLine = meta.startLine ?? 1;
      const endLine   = meta.endLine   ?? startLine;
      const filePath  = meta.relativePath;
      const content   = chunk.content ?? "";
      const snippet   = content
        .split("\n")
        .slice(0, 20)
        .map((line, i) => `${startLine + i}: ${line}`)
        .join("\n");
      const truncated = content.split("\n").length > 20
        ? "\n…(truncated)"
        : "";
      return [
        `--- Chunk ${idx + 1} ---`,
        `File: ${filePath} [lines ${startLine}–${endLine}]`,
        snippet,
        truncated,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  // 3️⃣ Build and return the final prompt
  return `
You are a senior performance-focused developer.
Below is the PageSpeed Insights data for route "${route}"
and the top ${topChunks.length} relevant code snippets.

=== PSI DATA ===
${psiSection}

=== CODE SNIPPETS ===
${chunksSection}

Your task:
For each metric (FCP, LCP, CLS, TBT) in the JSON skeleton below,
populate its "recommendedSteps" array of strings according to these rules:

1. Status entry (first only):
   - Must start with "Status: Good;", "Status: Moderate;", or "Status: Needs Improvement;"

2. Code Change entries:
   - Must start with "Code Change: from \`<old code>\` to \`<new code>\` in <file> lines X–Y; <explanation>"

3. General Tips entries:
   - Must start with "Tips: <concise recommendation>"

4. **Critical**: If a metric’s status is "Needs Improvement",
   you **must** include **at least one** "Code Change:" entry referencing
   the provided code snippets above. Do not skip code changes.

5. Do NOT modify the JSON structure or add extra fields.

Here is the JSON to update:
{
  "route": "${route}",
  "performanceData": [
    {
      "FCP": { "value": "<string>", "recommendedSteps": [] },
      "LCP": { "value": "<string>", "recommendedSteps": [] },
      "CLS": { "value": "<string>", "recommendedSteps": [] },
      "TBT": { "value": "<string>", "recommendedSteps": [] }
    }
  ]
}
`.trim();
}
