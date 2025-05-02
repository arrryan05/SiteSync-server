// src/services/vectorSearch.service.ts
import { IncludeEnum } from "chromadb";
import { getCollection } from "../lib/chroma";
import { CodeChunkResult } from "../code-analyzer/types";
import { buildQueryDbPrompt } from "../prompts/queryDbPrompt";
import { PageSpeedData } from "../types";

/**
 * Query Chroma for the top K code chunks most similar to the given PSI data & route.
 */
export async function queryTopChunks(
  route: string,
  psiData: PageSpeedData,
  collectionName: string = "sitesync",
  topK: number = 5
): Promise<CodeChunkResult[]> {
  // Build a concise textual query from PSI
  const { metrics, diagnostics, opportunities } = psiData;
  const queryText = buildQueryDbPrompt(route,psiData);

  const col = await getCollection(collectionName);
  const res = await col.query({
    queryTexts: [queryText],
    nResults: topK,
    include: [
      IncludeEnum.Documents,
      IncludeEnum.Metadatas,
      IncludeEnum.Distances,
    ],
  });

  console.log(res)

  // Unwrap the 2D arrays (one query → one result set)
  const ids = res.ids[0];
  const docs = res.documents[0];
  const metas = res.metadatas![0];
  const distances = res.distances![0];

  return ids.map((id, i) => ({
    id,
    content: docs[i],
    metadata: metas[i],
    distance: distances[i],
  }));
}
