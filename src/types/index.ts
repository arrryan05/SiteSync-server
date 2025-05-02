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

export interface PageSpeedData {
  url: string;
  overallScore?: number;
  metrics: {
    FCP?: string;
    LCP?: string;
    CLS?: string;
    TBT?: string;
  };
  diagnostics?: Record<string, any>; // Or you can create a stricter type if needed
  opportunities: {
    id: string;
    score: number;
  }[];
}
