// src/controllers/project.controller.ts

import { Request, RequestHandler, Response } from "express";
import { CreateProjectRequest, GetProjectDetailsRequest } from "../types/project.types";
import { createProject, getAllProjects, getProjectDetails } from "../services/project.service";

/**
 * Controller to create a new project.
 */
export const createProjectController = async (
  req: Request<{}, {}, CreateProjectRequest>,
  res: Response
) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json({ project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

/**
 * Controller to list all projects for a given user.
 * Expects userId as a URL parameter.
 */
export const getAllProjectsController = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    console.log("Inside controller")
    const projects = await getAllProjects(req.params.userId);
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

