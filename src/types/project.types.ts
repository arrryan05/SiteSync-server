// src/types/project.types.ts

// Request type for creating a project.
export interface CreateProjectRequest {
  website: string;
  name: string;
  userId: string;
}

// Response type for a project.
export interface ProjectResponse {
  id: string;
  name: string;
  url: string;
  analysisSummary: string;
  createdAt: Date;
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
export interface GetProjectResponse {
  id: string;
  name: string;
  website: string;
  analysisSummary: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
