// src/services/auth.service.ts

import { prisma } from "../config/prisma";
import { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from "../types/auth.types";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.util";

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      hashedPassword,
    },
  });

  // Generate JWT token
  const token = signToken({ userId: user.id, email: user.email });

  return {
    userId: user.id,
    email: user.email,
    name: user.name || undefined,
    token,
  };
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (!user || !user.hashedPassword) {
    throw new Error("Invalid credentials");
  }

  // Compare the password
  const isValid = await bcrypt.compare(data.password, user.hashedPassword);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = signToken({ userId: user.id, email: user.email });

  return {
    userId: user.id,
    email: user.email,
    name: user.name || undefined,
    token,
  };
}
