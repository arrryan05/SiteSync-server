// src/controllers/auth.controller.ts

import { Request, Response } from "express";
import { signup, login } from "../services/auth.service";
import { SignupRequest, LoginRequest } from "../types/auth.types";
import { findOrCreateUser } from "../services/user.service";
import { OAuth2Client } from "google-auth-library";
import { signToken } from "../utils/jwt.util";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export async function googleAuthController(req: Request, res: Response) {
  const { credential } = req.body; 
  console.log("logging with google");
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error("No email in token");

    // Lookup or create your user
    const user = await findOrCreateUser({
      email: payload.email,
      name: payload.name || "",
      provider: "google",
    });

    // Issue your own JWT
    const token = signToken({ userId: user.id });
    res.json({ token, user });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
}
