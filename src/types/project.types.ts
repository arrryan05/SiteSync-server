// src/types/project.types.ts

// Request type for creating a project.
export interface CreateProjectRequest {
  website: string;
  name: string;
  userId: string;
}


// Response type for listing projects.
export interface GetProjectListResponse {
  projects: ProjectResponse[];
}

// Request type for getting project details.
export interface GetProjectDetailsRequest {
  projectId: string;
  userId: string;
}

// Response type for a project.
export interface MetricDetail {
  value: string;
  recommendedSteps: string[];
}

export interface PerformanceMetrics {
  FCP: MetricDetail;
  LCP: MetricDetail;
  CLS: MetricDetail;
  TBT: MetricDetail;
}

export interface AnalysisInsight {
  route: string;
  performanceData: PerformanceMetrics[];
}

export interface ProjectResponse {
  id: string;
//   name: string;
  website: string;
  analysisSummary: AnalysisInsight[]; 
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
