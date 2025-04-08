export interface WebsiteAnalysisRequest {
  url: string;
}

export interface WebsiteAnalysisResponse {
  analysis: string;
  timestamp: string;
  url: string;
}

export interface GeminiResponse {
  response: {
    text(): Promise<string>;
  };
}
