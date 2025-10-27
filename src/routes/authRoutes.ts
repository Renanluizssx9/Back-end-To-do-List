import { Router } from "express";
import { register, login, deleteAccount } from "../controllers/authController";
import { authMiddleware } from "../middlewares/verifyJWT";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
