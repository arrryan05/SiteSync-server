// test-embed.ts
import "dotenv/config";
import { getCollection } from "../lib/chroma";

async function main() {
  const COL = "kloudemate2";
  const collection = await getCollection(COL);
  const preview = await collection.peek();
  console.log("👀 Preview:", preview);

  //   console.log("📦 Adding one doc via Jina embedder…");
  //   await collection.add({
  //     ids:       ["two"],
  //     documents: ["Hey"],
  //     metadatas: [{ note: "test-embed" }],
  //   });

  //   console.log("🔍 Querying for 'hello world'…");
  //   const results = await collection.query({
  //     queryTexts: ["hello world"],
  //     nResults:    1,
  //   });
  //   console.log("🎉 Query Results:", results);
}

main().catch((e) => {
  console.error("🚨 test-embed failed:", e.response?.data || e);
  process.exit(1);
});
