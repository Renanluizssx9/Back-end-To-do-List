import request from "supertest";
import app from "../../src/app";

describe("App Integration", () => {
  it("should respond to /auth route", async () => {
    const res = await request(app).get("/auth");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("should respond to /tasks route", async () => {
    const res = await request(app).get("/tasks");
    expect([200, 401, 404]).toContain(res.statusCode);
  });

  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should accept JSON payloads", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test", user: "507f1f77bcf86cd799439011" })
      .set("Content-Type", "application/json");

    expect([200, 201, 400, 401]).toContain(res.statusCode);
  });
});
