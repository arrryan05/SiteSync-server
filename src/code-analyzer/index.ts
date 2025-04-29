// src/code-analyzer/index.ts
import fs from "fs";
import { cloneRepo } from "./cloneRepo";
import { extractRelevantFiles } from "./extractRelevantFiles";
import { chunkCode } from "./chunkCode";
import { storeChunks } from "./storeChunks";

async function analyzeAndStore(
  repoUrl: string,
  collectionName: string = "sitesync"
) {
  // 1️⃣ Clone
  const repoPath = cloneRepo(repoUrl);
  console.log(`✅ Cloned to ${repoPath}`);

  try {
    // 2️⃣ Extract & chunk
    const files = await extractRelevantFiles(repoPath);
    console.log(`🔍 Found ${files.length} relevant files`);
    const chunks = chunkCode(files);
    console.log(`✂️  Split into ${chunks.length} code chunks`);

    // // 3️⃣ Embed (in parallel)
    // console.log(`🔗 Embedding ${chunks.length} chunks via Gemini…`);
    // const withEmbeddings = await embedChunks(chunks,1);
    // console.log(`🤖 Received embeddings for all chunks`);

    // 4️⃣ Store into Chroma
    console.log(`💾 Storing into Chroma collection: ${collectionName}`);
    await storeChunks(chunks, collectionName);
    console.log(`✨ Done!`);
  } finally {
    // 5️⃣ Cleanup
    fs.rmSync(repoPath, { recursive: true, force: true });
    console.log(`🧹 Removed temp folder`);
  }
}

// If run directly from CLI:
if (require.main === module) {
  const repoUrl = process.argv[2];
  const collection = process.argv[3]; // optional
  if (!repoUrl) {
    console.error("Usage: ts-node src/code-analyzer/index.ts <git-repo-url> [collection]");
    process.exit(1);
  }
  analyzeAndStore(repoUrl, collection)
    .catch((err) => {
      console.error("❌ Failed:", err);
      process.exit(1);
    });
}

export { analyzeAndStore };
