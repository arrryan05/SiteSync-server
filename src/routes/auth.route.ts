// src/routes/auth.route.ts

import express from "express";
import { signupController, loginController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);

export default router;
