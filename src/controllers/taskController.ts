import { Response } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";
import { AuthRequest } from "../types/auth";

export const listTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await getTasks(req.userId!);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
};

export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "O título é obrigatório" });

    const task = await createTask(req.userId!, title);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};

export const editTask = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await updateTask(req.userId!, req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

export const removeTask = async (req: AuthRequest, res: Response) => {
  try {
    const success = await deleteTask(req.userId!, req.params.id);
    if (!success) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
};
