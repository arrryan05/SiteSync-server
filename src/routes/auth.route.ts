// src/routes/auth.route.ts

import express from "express";
import { signupController, loginController, googleAuthController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/auth/google", googleAuthController);


export default router;
