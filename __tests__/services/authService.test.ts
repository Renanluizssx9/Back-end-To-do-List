import { registerUser, loginUser } from "../../src/services/authService";
import User from "../../src/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should return 400 if email or password is missing", async () => {
      const result = await registerUser({ email: "", password: "" });
      expect(result.status).toBe(400);
      expect(result.data).toEqual({
        error: "Email and password are required.",
      });
    });

    it("should return 400 if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      const result = await registerUser({
        email: "test@example.com",
        password: "123456",
      });
      expect(result.status).toBe(400);
      expect(result.data).toEqual({ error: "User already exists." });
    });

    it("should create user and return token", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
      (jwt.sign as jest.Mock).mockReturnValue("token123");
      (User.prototype.save as jest.Mock).mockResolvedValue(undefined);

      const result = await registerUser({
        email: "new@example.com",
        password: "123456",
      });
      expect(result.status).toBe(201);
      expect(result.data).toEqual({
        message: "User created successfully.",
        token: "token123",
      });
    });
  });

  describe("loginUser", () => {
    it("should return 400 if email or password is missing", async () => {
      const result = await loginUser({ email: "", password: "" });
      expect(result.status).toBe(400);
      expect(result.data).toEqual({
        error: "Email and password are required.",
      });
    });

    it("should return 400 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await loginUser({
        email: "missing@example.com",
        password: "123456",
      });
      expect(result.status).toBe(400);
      expect(result.data).toEqual({ error: "User not found." });
    });

    it("should return 400 if password is incorrect", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: "hashedpass" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await loginUser({
        email: "test@example.com",
        password: "wrongpass",
      });
      expect(result.status).toBe(400);
      expect(result.data).toEqual({ error: "Incorrect password." });
    });

    it("should return token if login is successful", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        password: "hashedpass",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token123");

      const result = await loginUser({
        email: "test@example.com",
        password: "123456",
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual({
        message: "Login successful.",
        token: "token123",
      });
    });
  });
});
