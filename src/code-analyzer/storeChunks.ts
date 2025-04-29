// // src/code-analyzer/storeChunks.ts
// import { getCollection } from "../lib/chroma";
// import { CodeChunk } from "./types";

// /**
//  * Store embedded code chunks into ChromaDB
//  * @param chunks Array of code chunks with embedding vectors
//  * @param collectionName Logical group name (e.g. project name or repo slug)
//  */
// export const storeChunks = async (
//   chunks: CodeChunk[],
//   collectionName: string = "sitesync"
// ) => {
//   const collection = await getCollection(collectionName);

//   await collection.add({
//     ids:        chunks.map((c) => c.chunkId),
//     // embeddings: chunks.map((c) => c.embedding),
//     documents:  chunks.map((c) => c.content),
//     metadatas:  chunks.map((c) => ({
//       filePath:           c.filePath,                           // string
//       relativePath:       c.relativePath,                       // string
//       ext:                c.ext,                                // string
//       routeHint:          c.routeHint ?? "",                    // string (never undefined)
//       tags:               c.tags.join(","),                     // string (no arrays)
//       lineCount:          c.lineCount,                          // number
//       importCount:        c.importCount,                        // number
//       dynamicImportCount: c.dynamicImportCount,                 // number
//     })),
//   });

//   console.log(
//     `✅ Stored ${chunks.length} chunks to ChromaDB in collection: ${collectionName}`
//   );
// };

// src/code-analyzer/storeChunks.ts
import { getCollection } from "../lib/chroma";
import type { CodeChunk } from "./types";

const BATCH_SIZE = 1;

export const storeChunks = async (
  chunks: CodeChunk[],
  collectionName: string = "sitesync"
) => {
  const col = await getCollection(collectionName);
  const ids = chunks.map((c) => c.chunkId);
  const docs = chunks.map((c) => c.content);
  const metas = chunks.map((c) => ({
    filePath: c.filePath,
    relativePath: c.relativePath,
    ext: c.ext,
    routeHint: c.routeHint ?? "",
    tags: c.tags.join(","),
    lineCount: c.lineCount,
    importCount: c.importCount,
    dynamicImportCount: c.dynamicImportCount,
  }));

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batchIds = ids.slice(i, i + BATCH_SIZE);
    const batchDocs = docs.slice(i, i + BATCH_SIZE);
    const batchMetas = metas.slice(i, i + BATCH_SIZE);

    // // Debug log
    // console.log(`🟢 Adding batch ${i / BATCH_SIZE + 1}:`, {
    //   count: batchIds.length,
    //   firstId: batchIds[0],
    // });

    console.log(
      "💬 PAYLOAD FOR Chroma.add:",
      JSON.stringify(
        {
          ids: batchIds,
          documents: batchDocs,
          metadatas: batchMetas,
        },
        null,
        2
      )
    );

    await col.add({
      ids: batchIds,
      documents: batchDocs,
      metadatas: batchMetas,
    });

    console.log(`✅ Batch ${i / BATCH_SIZE + 1} stored`);
  }

  console.log(`✨ All ${ids.length} chunks stored in "${collectionName}"`);
};
