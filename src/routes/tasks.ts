import { Router } from "express";
import { Task } from "../models/task";
import { authMiddleware, AuthRequest } from "../middlewares/jwtMiddleware";

const router = Router();

// Listar tarefas do usuário
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});

// Criar tarefa
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "O título é obrigatório" });

  const task = await Task.create({ title, user: req.userId });
  res.status(201).json(task);
});

// Atualizar tarefa
router.put("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { title, completed } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { title, completed },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(task);
});

// Deletar tarefa
router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.status(204).send();
});

export default router;
