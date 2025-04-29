// src/code-analyzer/chunkCode.ts

import fs from "fs";
import { FileMeta, CodeChunk } from "./types";

// Tune your chunk size to ~500–1 000 tokens (here: 75 lines)
const LINES_PER_CHUNK = 30;

export function chunkCode(files: FileMeta[]): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  for (const meta of files) {
    const text = fs.readFileSync(meta.filePath, "utf-8");
    const lines = text.split("\n");
    const totalLines = lines.length;

    for (let i = 0; i < totalLines; i += LINES_PER_CHUNK) {
      const start = i;
      const end = Math.min(i + LINES_PER_CHUNK, totalLines);
      const slice = lines.slice(start, end).join("\n");
      const chunkId =
        meta.relativePath.replace(/[\W]/g, "_") + `-${start}`;

      // Build tags for quick filtering
      const tags: string[] = [];
      if (meta.routeHint) tags.push(`route:${meta.routeHint}`);
      tags.push(`ext:${meta.ext.replace(".", "")}`);
      if (meta.importCount > 5) tags.push("heavy-imports");
      if (meta.dynamicImportCount > 0) tags.push("code-splitting");

      chunks.push({
        chunkId,
        content: slice,
        filePath: meta.filePath,
        relativePath: meta.relativePath,
        ext: meta.ext,
        routeHint: meta.routeHint,
        startLine: start + 1,
        endLine: end,
        sizeBytes: meta.sizeBytes,
        lineCount: end - start,
        importCount: meta.importCount,
        dynamicImportCount: meta.dynamicImportCount,
        tags,
      });
    }
  }

  return chunks;
}
