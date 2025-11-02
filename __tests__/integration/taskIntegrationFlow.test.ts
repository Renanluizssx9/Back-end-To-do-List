import request from "supertest";
import app from "../../src/app";
import { connect, close } from "../setup/db";
import jwt from "jsonwebtoken";

let token: string;
let userId: string;
let taskId: string;

beforeAll(async () => {
  await connect();

  const registerRes = await request(app).post("/auth/register").send({
    email: "taskuser@example.com",
    password: "123456",
  });

  expect(registerRes.statusCode).toBe(201);
  expect(registerRes.body).toHaveProperty("token");

  token = registerRes.body.token;

  const decoded = jwt.decode(token) as { id: string };
  userId = decoded.id;
});

afterAll(async () => await close());

describe("Task Integration Flow", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration task",
        user: userId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "Integration task");
    expect(res.body).toHaveProperty("user", userId);
    expect(res.body).toHaveProperty("completed", false);

    taskId = res.body._id;
  });

  it("should list tasks for the user", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("title", "Integration task");
  });

  it("should update the task", async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("completed", true);
  });

  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect([200, 204]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty("message");
    }
  });

  it("should return empty list after deletion", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
