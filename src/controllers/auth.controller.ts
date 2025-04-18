// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import { signup, login } from "../services/auth.service";
import { SignupRequest, LoginRequest } from "../types/auth.types";

export const signupController = async (req: Request, res: Response) => {
  try {
    const data = req.body as SignupRequest;
    const result = await signup(data);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const data = req.body as LoginRequest;
    const result = await login(data);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
};
