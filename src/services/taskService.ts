import { Task } from "../models/taskModel";
import { TaskPayload } from "../types/task";

export const getTasks = async (userId: string) => {
  return await Task.find({ user: userId });
};

export const createTask = async (userId: string, title: string) => {
  return await Task.create({ title, user: userId });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: TaskPayload
) => {
  return await Task.findOneAndUpdate({ _id: taskId, user: userId }, data, {
    new: true,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  return !!task;
};
