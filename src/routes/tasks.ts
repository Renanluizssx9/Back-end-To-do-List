import { Router } from "express";
import { Task } from "../models/task";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "O título é obrigatório" });
    }

    const newTask = await Task.create({ title });
    res.status(201).json(newTask);
    console.log(newTask)
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar tarefa" });
    
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
      

    );
    // console.log(title);
      console.log(completed);

    if (!updatedTask) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
});

export default router;
