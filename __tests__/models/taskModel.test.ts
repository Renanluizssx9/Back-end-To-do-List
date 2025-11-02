import mongoose from "mongoose";
import { connect, close } from "../setup/db";
import { Task } from "../../src/models/taskModel";

beforeAll(async () => await connect());
afterAll(async () => await close());

describe("Task Model Integration", () => {
  it("should save and retrieve a task", async () => {
    const task = new Task({
      user: new mongoose.Types.ObjectId(),
      title: "Integration test",
    });

    await task.save();

    const found = await Task.findOne({ title: "Integration test" });
    expect(found).not.toBeNull();
    expect(found?.title).toBe("Integration test");
    expect(found?.completed).toBe(false);
  });

  it("should fail to save without required fields", async () => {
    const task = new Task({});
    await expect(task.save()).rejects.toThrow();
  });

  it("should update a task", async () => {
    const task = await Task.create({
      user: new mongoose.Types.ObjectId(),
      title: "To update",
    });

    task.completed = true;
    await task.save();

    const updated = await Task.findById(task._id);
    expect(updated?.completed).toBe(true);
  });

  it("should delete a task", async () => {
    const task = await Task.create({
      user: new mongoose.Types.ObjectId(),
      title: "To delete",
    });

    await Task.findByIdAndDelete(task._id);
    const deleted = await Task.findById(task._id);
    expect(deleted).toBeNull();
  });
});
