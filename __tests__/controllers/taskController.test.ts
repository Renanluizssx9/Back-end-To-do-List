import {
  listTasks,
  addTask,
  editTask,
  removeTask,
} from "../../src/controllers/taskController";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../src/services/taskService";

jest.mock("../../src/services/taskService");

const mockReq = (body = {}, userId = "user123", params = {}) =>
  ({ body, userId, params } as any);
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("taskController", () => {
  it("should list tasks", async () => {
    const req = mockReq();
    const res = mockRes();
    (getTasks as jest.Mock).mockResolvedValue([{ title: "Task 1" }]);

    await listTasks(req, res);

    expect(res.json).toHaveBeenCalledWith([{ title: "Task 1" }]);
  });

  it("should return 400 if title is missing", async () => {
    const req = mockReq({});
    const res = mockRes();

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
  });

  it("should create task", async () => {
    const req = mockReq({ title: "New Task" });
    const res = mockRes();
    (createTask as jest.Mock).mockResolvedValue({
      id: "task123",
      title: "New Task",
    });

    await addTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "task123", title: "New Task" });
  });

  it("should update task", async () => {
    const req = mockReq({ title: "Updated" }, "user123", { id: "task123" });
    const res = mockRes();
    (updateTask as jest.Mock).mockResolvedValue({
      id: "task123",
      title: "Updated",
    });

    await editTask(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: "task123", title: "Updated" });
  });

  it("should return 404 if task not found on update", async () => {
    const req = mockReq({ title: "Updated" }, "user123", { id: "task123" });
    const res = mockRes();
    (updateTask as jest.Mock).mockResolvedValue(null);

    await editTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });

  it("should delete task", async () => {
    const req = mockReq({}, "user123", { id: "task123" });
    const res = mockRes();
    (deleteTask as jest.Mock).mockResolvedValue(true);

    await removeTask(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it("should return 404 if task not found on delete", async () => {
    const req = mockReq({}, "user123", { id: "task123" });
    const res = mockRes();
    (deleteTask as jest.Mock).mockResolvedValue(false);

    await removeTask(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
  });
});
