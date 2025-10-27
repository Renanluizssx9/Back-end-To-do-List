import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import User from "../models/userModel";
import { AuthRequest } from "../types/auth";

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(result.status).json(result.data);
};

export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  res.status(result.status).json(result.data);
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting account" });
  }
};
