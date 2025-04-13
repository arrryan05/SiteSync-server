import express from "express";
import { seedTestData } from "../controllers/seed.controller";

const router = express.Router();

router.post("/seed", seedTestData);

export default router;
