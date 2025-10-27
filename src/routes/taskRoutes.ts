import { Router } from "express";
import { authMiddleware } from "../middlewares/verifyJWT";
import { listTasks, addTask, editTask, removeTask } from "../controllers/taskController";

const router = Router();
router.get("/", authMiddleware, listTasks);
router.post("/", authMiddleware, addTask);
router.put("/:id", authMiddleware, editTask);
router.delete("/:id", authMiddleware, removeTask);
export default router;
