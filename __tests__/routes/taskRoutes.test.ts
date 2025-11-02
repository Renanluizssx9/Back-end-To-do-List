import express from "express";
import request from "supertest";
import taskRoutes from "../../src/routes/taskRoutes";
import * as taskController from "../../src/controllers/taskController";

jest.mock("../../src/controllers/taskController");
jest.mock("../../src/middlewares/verifyJWT", () => ({
  authMiddleware: (_req: any, _res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

describe("Task Routes", () => {
  it("GET /tasks should call listTasks controller", async () => {
    (taskController.listTasks as jest.Mock).mockImplementation((req, res) =>
      res.status(200).json([{ title: "Task 1" }])
    );

    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ title: "Task 1" }]);
  });

  it("POST /tasks should call addTask controller", async () => {
    (taskController.addTask as jest.Mock).mockImplementation((req, res) =>
      res.status(201).json({ title: "New Task" })
    );

    const res = await request(app).post("/tasks").send({ title: "New Task" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ title: "New Task" });
  });

  it("PUT /tasks/:id should call editTask controller", async () => {
    (taskController.editTask as jest.Mock).mockImplementation((req, res) =>
      res.status(200).json({ title: "Updated Task" })
    );

    const res = await request(app)
      .put("/tasks/123")
      .send({ title: "Updated Task" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ title: "Updated Task" });
  });

  it("DELETE /tasks/:id should call removeTask controller", async () => {
    (taskController.removeTask as jest.Mock).mockImplementation((req, res) =>
      res.status(204).send()
    );

    const res = await request(app).delete("/tasks/123");
    expect(res.status).toBe(204);
  });
});
