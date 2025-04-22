import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifySseToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Extract token from query string
  const token = req.query.token as string;

  if (!token) {
    res.status(401).json({ error: "No token provided in query" });
    return;  // Do not return a response directly, just end the middleware
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    req.user = { userId: decoded.userId };
    next();  // Continue to the next middleware/controller
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
