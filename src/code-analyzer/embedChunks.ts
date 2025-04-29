

// // // revised embedChunks.ts
// // import { GoogleGenAI } from "@google/genai";
// // import { runWithConcurrency,retryWithExponentialBackoff } from "../utils/ratelimit.util";
// // import type { CodeChunk, CodeChunkWithEmbedding } from "./types";
// // import { config } from "../config";

// // const genAI = new GoogleGenAI({ apiKey: config.geminiApiKey! });

// // // Batch size and delays tuned to 2 RPM free-tier
// // const BATCH_SIZE = 5;
// // const DELAY_MS   = 30_000;

// // export async function embedChunks(
// //   chunks: CodeChunk[],
// //   concurrency = 1
// // ): Promise<CodeChunkWithEmbedding[]> {
// //   // Split into batches of 5
// //   const batches = [];
// //   for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
// //     batches.push(chunks.slice(i, i + BATCH_SIZE));
// //   }

// //   const allResults: (CodeChunkWithEmbedding | null)[] = [];
// //   for (const batch of batches) {
// //     const results = await runWithConcurrency(
// //       batch,
// //       concurrency,
// //       async (chunk) => {
// //         // Retry on 429 with exponential backoff
// //         const resp = await retryWithExponentialBackoff(
// //           () => genAI.models.embedContent({
// //             model:    "gemini-embedding-exp-03-07",
// //             contents: chunk.content,
// //           }),
// //           5,    // max retries
// //           1000  // base delay
// //         );
// //         const vector = (resp as any).embeddings as number[];
// //         return { ...chunk, embedding: vector };
// //       }
// //     );
// //     allResults.push(...results);
// //     // Wait 30s before next batch to honor 2 RPM
// //     await new Promise((r) => setTimeout(r, DELAY_MS));
// //   }

// //   // Filter out any nulls from permanently failed tasks
// //   return allResults.filter(
// //     (c): c is CodeChunkWithEmbedding => c !== null
// //   );
// // }


// // src/code-analyzer/embedChunks.ts
// import { GoogleGenAI } from "@google/genai";
// import {
//   runWithConcurrency,
//   retryWithExponentialBackoff,
// } from "../utils/ratelimit.util";
// import type {
//   CodeChunk,
//   CodeChunkWithEmbedding,
// } from "./types";
// import { config } from "../config";

// const genAI = new GoogleGenAI({ apiKey: config.geminiApiKey! });

// // Honor Gemini free-tier: 2 RPM → wait 30s between calls
// const PAUSE_MS = 30_000;

// export async function embedChunks(
//   chunks: CodeChunk[],
//   concurrency = 1
// ): Promise<CodeChunkWithEmbedding[]> {
//   const results = await runWithConcurrency<CodeChunk, CodeChunkWithEmbedding>(
//     chunks,
//     concurrency,
//     async (chunk) => {
//       // Retry on 429 / RESOURCE_EXHAUSTED
//       const resp = await retryWithExponentialBackoff(() =>
//         genAI.models.embedContent({
//           model: "gemini-embedding-exp-03-07",
//           contents: chunk.content,
//         })
//       );

//       // Unwrap to pure number[]:
//       const raw = (resp as any).embeddings;
//       let vector: number[];

//       if (Array.isArray(raw)) {
//         const first = raw[0];
//         vector = first?.values ?? (raw as unknown as number[]);
//       } else {
//         vector = (raw as any).values;
//       }

//       // 📎 pause before the next call
//       await new Promise((r) => setTimeout(r, PAUSE_MS));

//       return { ...chunk, embedding: vector };
//     }
//   );

//   // Filter out permanent failures (null)
//   return results.filter(
//     (c): c is CodeChunkWithEmbedding => c !== null
//   );
// }
