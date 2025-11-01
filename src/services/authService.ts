import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import User from "../models/userModel";
import { AuthCredentials } from "../types/user";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET: Secret = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ??
  "1h") as jwt.SignOptions["expiresIn"];

export const registerUser = async ({ email, password }: AuthCredentials) => {
  if (!email || !password) {
    return { status: 400, data: { error: "Email and password are required." } };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { status: 400, data: { error: "User already exists." } };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    status: 201,
    data: { message: "User created successfully.", token },
  };
};

export const loginUser = async ({ email, password }: AuthCredentials) => {
  if (!email || !password) {
    return { status: 400, data: { error: "Email and password are required." } };
  }

  const user = await User.findOne({ email });
  if (!user) {
    return { status: 400, data: { error: "User not found." } };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: 400, data: { error: "Incorrect password." } };
  }

  const token = jwt.sign({ id: user._id, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    status: 200,
    data: { message: "Login successful.", token },
  };
};
