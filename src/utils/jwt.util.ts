import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_default_jwt_secret";

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

// export function verifyToken(token: string): JwtPayload | null {
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     // Ensure it's a JwtPayload, not a string
//     if (typeof decoded === "object" && decoded !== null) {
//       return decoded as JwtPayload;
//     }
//     return null;
//   } catch (error) {
//     return null;
//   }
// }

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { userId: decoded.userId }; // Attach user to request
    next(); // ✅ continue to the next middleware/controller
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
