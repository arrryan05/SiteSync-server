// src/services/project.service.ts

import { prisma } from "../config/prisma";
import {
  AnalysisInsight,
  CreateProjectRequest,
  GetProjectDetailsRequest,
  ProjectResponse,
} from "../types/project.types";

type PrismaProject = Awaited<
  ReturnType<typeof prisma.project.findMany>
>[number];

/**
 * Creates a new project record.
 */
export async function createProject(
  data: CreateProjectRequest
): Promise<ProjectResponse> {
  const project = await prisma.project.create({
    data: {
      // name: data.name,
      website: data.website,
      status: "pending",
      userId: data.userId,
    },
  });

  const raw = project.analysis;
  const analysisSummary: AnalysisInsight[] = Array.isArray(raw)
    ? (raw as unknown as AnalysisInsight[])
    : [];

  return {
    id: project.id,
    //   name: project.name,
    website: project.website,
    analysisSummary,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

/**
 * Retrieves all projects for a user.
 */
export const getAllProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Retrieves details for a single project.
 */
export async function getProjectDetails(data: {
  projectId: string;
  userId: string;
}): Promise<ProjectResponse | null> {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });
  if (!project || project.userId !== data.userId) return null;

  const raw = project.analysis;
  const analysisSummary: AnalysisInsight[] = Array.isArray(raw)
    ? (raw as unknown as AnalysisInsight[])
    : [];

  return {
    id: project.id,
    //   name: project.name,
    website: project.website,
    analysisSummary,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function deleteProject(
  projectId: string,
  userId: string
): Promise<void> {
  // Ensure project belongs to user
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.userId !== userId) {
    throw new Error("Not authorized");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });
}
