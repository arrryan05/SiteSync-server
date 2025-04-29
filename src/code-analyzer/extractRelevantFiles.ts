// src/code-analyzer/extractRelevantFiles.ts

import fg from "fast-glob";
import fs from "fs";
import path from "path";
import { FileMeta } from "./types";  // ← use FileMeta here

export async function extractRelevantFiles(
  root: string
): Promise<FileMeta[]> {            // ← return FileMeta[], not CodeChunk[]

  const patterns = [
    'pages/**/*.{js,ts,jsx,tsx}',
    'src/pages/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}',
    'src/**/*.{css,scss,sass,less,styl}',
    'public/**/*.{png,jpg,jpeg,svg,gif,webp}',
    '**/*.html',
  ];
  const ignore   = [ "**/node_modules/**", "**/.git/**" ];

  const relativePaths = await fg(patterns, {
    cwd: root,
    ignore,
    dot: true,
  });

  const metas: FileMeta[] = [];      // ← array of FileMeta

  for (const rel of relativePaths) {
    const abs = path.join(root, rel);
    const ext = path.extname(rel).toLowerCase();

    let content = "";
    const isText = ![".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext);
    if (isText) {
      try {
        content = fs.readFileSync(abs, "utf-8");
      } catch {
        content = "";
      }
    }

    const sizeBytes           = fs.statSync(abs).size;
    const lineCount           = isText ? content.split("\n").length : 0;
    const importCount         = isText ? (content.match(/\bimport\b/g) || []).length : 0;
    const dynamicImportCount  = isText ? (content.match(/import\(/g)  || []).length : 0;

    let routeHint: string | undefined;
    if (rel.startsWith("pages/") || rel.startsWith("src/pages/")) {
      routeHint = "/" + rel
        .replace(/^src\/pages\//, "")
        .replace(/^pages\//, "")
        .replace(path.extname(rel), "")
        .replace(/index$/, "");
    }

    // Push a FileMeta, not a CodeChunk
    metas.push({
      filePath:           abs,
      relativePath:       rel,
      ext,
      sizeBytes,
      lineCount,
      importCount,
      dynamicImportCount,
      routeHint,
    });
  }

  return metas;
}
