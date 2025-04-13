// src/routes/project.route.ts

import express from "express";
import {
  createProjectController,
  getAllProjectsController,
} from "../controllers/project.controller";
import { seedTestData } from "../controllers/seed.controller";

const router = express.Router();

console.log("Inside project")

// Create a new project.
// POST /api/project/create
router.post("/create", createProjectController);

// List all projects for a user.
// GET /api/project/list/:userId
router.get("/list/:userId", getAllProjectsController);





export default router;
