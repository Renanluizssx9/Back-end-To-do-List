import express from "express";
import request from "supertest";
import authRouter from "../../src/routes/authRoutes";
import User from "../../src/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

// Mocks
jest.mock("../../src/models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

// App setup
const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🔐 REGISTER
  describe("POST /auth/register", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/auth/register").send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Email and password are required." });
    });

    it("should return 400 if user already exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      const res = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "123456" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "User already exists." });
    });

    it("should register user and return token", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpass");
      (jwt.sign as jest.Mock).mockReturnValue("token123");
      (User.prototype.save as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post("/auth/register")
        .send({ email: "new@example.com", password: "123456" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: "User created successfully.",
        token: "token123",
      });
    });
  });

  // 🔑 LOGIN
  describe("POST /auth/login", () => {
    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/auth/login").send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Email and password are required." });
    });

    it("should return 400 if user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "missing@example.com", password: "123456" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "User not found." });
    });

    it("should return 400 if password is incorrect", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ password: "hashedpass" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Incorrect password." });
    });

    it("should login user and return token", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "user123",
        email: "test@example.com",
        password: "hashedpass",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token123");

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "123456" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: "Login successful.",
        token: "token123",
      });
    });
  });
});
