import express from "express";
import request from "supertest";
import authRoutes from "../../src/routes/authRoutes";
import * as authController from "../../src/controllers/authController";

jest.mock("../../src/controllers/authController");
jest.mock("../../src/middlewares/verifyJWT", () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  it("POST /auth/register should call register controller", async () => {
    (authController.register as jest.Mock).mockImplementation((req, res) =>
      res.status(201).json({ message: "Registered" })
    );

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "a@b.com", password: "123" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Registered" });
  });

  it("POST /auth/login should call login controller", async () => {
    (authController.login as jest.Mock).mockImplementation((req, res) =>
      res.status(200).json({ message: "Logged in" })
    );

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@b.com", password: "123" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Logged in" });
  });

  it("DELETE /auth/delete should call deleteAccount controller with authMiddleware", async () => {
    (authController.deleteAccount as jest.Mock).mockImplementation((req, res) =>
      res.status(200).json({ message: "Deleted" })
    );

    const res = await request(app).delete("/auth/delete");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
});
