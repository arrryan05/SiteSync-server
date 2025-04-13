// src/services/project.service.ts

import { prisma } from "../config/prisma";
import { CreateProjectRequest, GetProjectDetailsRequest, GetProjectResponse, ProjectResponse } from "../types/project.types";

type PrismaProject = Awaited<ReturnType<typeof prisma.project.findMany>>[number];

/**
 * Creates a new project record.
 */
export async function createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
  const project = await prisma.project.create({
    data: {
      website: data.website,
      userId: data.userId,
      status: "pending",
      // You can add a field "name" if desired. Here, we use "name" as provided.
      // analysis is initially null.
    },
  });
  return {
    id: project.id,
    name: data.name,
    url: project.website,
    analysisSummary: project.analysis ? JSON.stringify(project.analysis) : "",
    createdAt: project.createdAt,
  };
}

/**
 * Retrieves all projects for a user.
 */
export async function getAllProjects(userId: string): Promise<ProjectResponse[]> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return projects.map((project: PrismaProject) => ({
    id: project.id,
    name: project.website,  // or project.name if you store a separate name
    url: project.website,
    analysisSummary: project.analysis ? JSON.stringify(project.analysis) : "",
    createdAt: project.createdAt,
  }));
}

/**
 * Retrieves details for a single project.
 */
export async function getProjectDetails(
    data: GetProjectDetailsRequest
  ): Promise<GetProjectResponse | null> {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    // Ensure the project belongs to the requesting user.
    if (!project || project.userId !== data.userId) return null;
    
    return {
      id: project.id,
      name: project.website, // Or use a separate name field if available.
      website: project.website,
      analysisSummary: project.analysis ? JSON.stringify(project.analysis) : "",
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
