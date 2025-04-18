// src/routes/project.route.ts

import express from "express";
import {
  createProjectController,
  getAllProjectsController,
  getProjectDetailsController,
} from "../controllers/project.controller";
import { seedTestData } from "../controllers/seed.controller";
import { verifyToken } from "../middlerware/verifyToken";

const router = express.Router();

console.log("Inside project")

// Create a new project. 
// POST /api/project/create
router.post("/create",verifyToken, createProjectController);

router.get("/list", verifyToken, getAllProjectsController);
router.get("/:projectId", verifyToken, getProjectDetailsController);



export default router;
