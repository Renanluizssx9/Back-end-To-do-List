import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { AuthRequest } from "../types/auth";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET not defined. Check your .env file.");
  }
  return secret;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("🔐 Token verification error:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};
