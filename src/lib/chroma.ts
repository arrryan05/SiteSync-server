import "dotenv/config";
import { ChromaClient, IEmbeddingFunction } from "chromadb";

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export class CohereEmbeddingFunction implements IEmbeddingFunction {
  name: string = process.env.COHERE_MODEL_NAME || "embed-english-v3.0";

  async generate(texts: string[]): Promise<number[][]> {
    const response = await cohere.embed({
      model: this.name,
      inputType: "search_document",
      texts,
    });

    const embs = response.embeddings; // ✅ Updated field
    if (!Array.isArray(embs) || !Array.isArray(embs[0])) {
      throw new Error(
        `Unexpected response from Cohere: ${JSON.stringify(response)}`
      );
    }

    console.log(
      `🧠 [Cohere] embedded ${texts.length} texts → dim=${embs[0].length}`
    );
    return embs;
  }
}

export const chroma = new ChromaClient({
  path: process.env.CHROMA_SERVER_URL || "http://localhost:8000",
});

const cohereEmbFn: IEmbeddingFunction = new CohereEmbeddingFunction();

// 3️⃣ Provide it whenever we get/create a collection
export async function getCollection(name: string) {
  return chroma.getOrCreateCollection({
    name,
    embeddingFunction: cohereEmbFn, 
  });
}
