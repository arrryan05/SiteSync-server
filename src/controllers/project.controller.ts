// src/controllers/project.controller.ts

import { Request, RequestHandler, Response } from "express";
import {
  CreateProjectRequest,
  GetProjectDetailsRequest,
} from "../types/project.types";
import {
  createProject,
  getAllProjects,
  getProjectDetails,
} from "../services/project.service";
import { analysisQueue } from "../lib/queue";

/**
 * Controller to create a new project.
 */
export const createProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { name, website } = req.body;
    if (!name || !website) {
      res.status(400).json({ error: "Name & website required" });
      return;
    }

    const data: CreateProjectRequest = { name, website, userId };
    const project = await createProject(data);

    await analysisQueue.add(
      { projectId: project.id, website: project.website },
      { attempts: 3, backoff: { type: "exponential", delay: 5000 } }
    );

    res.status(201).json({ project });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// src/controllers/project.controller.ts
export const getAllProjectsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const projects = await getAllProjects(userId);
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectDetailsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract projectId and userId from query parameters
    const projectId = req.params.projectId; // from route like /:projectId
    const userId = req.user?.userId;

    console.log("DEBUG => userId:", userId);
    console.log("DEBUG => projectId:", projectId);

    if (!projectId || !userId) {
      res.status(400).json({ error: "Missing projectId or userId" });
      return;
    }

    const detailsRequest: GetProjectDetailsRequest = { projectId, userId };

    const project = await getProjectDetails(detailsRequest);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.status(200).json({ project });
    return;
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ error: "Failed to fetch project details" });
    return;
  }
};
