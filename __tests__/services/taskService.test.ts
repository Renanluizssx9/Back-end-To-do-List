import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../src/services/taskService";
import { Task } from "../../src/models/taskModel";

jest.mock("../../src/models/taskModel");

describe("taskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get tasks for a user", async () => {
    (Task.find as jest.Mock).mockResolvedValue([{ title: "Task 1" }]);

    const result = await getTasks("user123");
    expect(result).toEqual([{ title: "Task 1" }]);
  });

  it("should create a task", async () => {
    (Task.create as jest.Mock).mockResolvedValue({ title: "New Task" });

    const result = await createTask("user123", "New Task");
    expect(result).toEqual({ title: "New Task" });
  });

  it("should update a task", async () => {
    (Task.findOneAndUpdate as jest.Mock).mockResolvedValue({
      title: "Updated Task",
    });

    const result = await updateTask("user123", "task123", {
      title: "Updated Task",
    });
    expect(result).toEqual({ title: "Updated Task" });
  });

  it("should delete a task and return true", async () => {
    (Task.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "task123" });

    const result = await deleteTask("user123", "task123");
    expect(result).toBe(true);
  });

  it("should return false if task not found on delete", async () => {
    (Task.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await deleteTask("user123", "task123");
    expect(result).toBe(false);
  });
});
