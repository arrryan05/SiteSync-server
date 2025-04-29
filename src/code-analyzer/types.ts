// src/code-analyzer/types.ts

/**  
 * Metadata for each source file  
 */
export interface FileMeta {
    filePath:           string;
    relativePath:       string;
    ext:                string;
    sizeBytes:          number;
    lineCount:          number;
    importCount:        number;
    dynamicImportCount: number;
    routeHint?:         string;    // e.g. "/about"
  }
  
  /**  
   * One embeddable chunk, enriched with file metadata  
   */
  // src/code-analyzer/types.ts
export interface CodeChunk {
  chunkId:       string;
  content:       string;
  filePath:      string;
  relativePath:  string;
  ext:           string;
  routeHint?:    string;
  startLine:     number;
  endLine:       number;
  sizeBytes:     number;           
  lineCount:     number;
  importCount:   number;
  dynamicImportCount: number;
  tags:          string[];
}

// Extend your existing CodeChunk with the embedding vector:
export interface CodeChunkWithEmbedding extends CodeChunk {
  embedding: number[];   // now explicitly typed
}

  