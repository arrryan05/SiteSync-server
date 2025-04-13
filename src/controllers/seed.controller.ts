import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedTestData = async (_: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: "testuser@example.com",
        name: "Test User",
      },
    });

    const project = await prisma.project.create({
      data: {
        website: "https://example.com",
        userId: user.id,
      },
    });

    res.status(201).json({
      message: "Seed data created",
      userId: user.id,
      projectId: project.id,
    });
  } catch (err) {
    console.error("Seeding failed:", err);
    res.status(500).json({ error: "Failed to seed test data" });
  }
};
