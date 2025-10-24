import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import type { StringValue } from "ms";
import User from "../models/user";

dotenv.config();

const router = express.Router();

// -----------------------------
// Tipagem segura para JWT
// -----------------------------
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no arquivo .env");
}

// ✅ Conversão explícita para tipo aceito
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "1h") as StringValue;

// ===========================
// 🔹 Cadastro (Register)
// ===========================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const payload = { id: newUser._id, email: newUser.email };
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN };

    const token = jwt.sign(payload, JWT_SECRET, options);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      token,
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ===========================
// 🔹 Login
// ===========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const payload = { id: user._id, email: user.email };
    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN };

    const token = jwt.sign(payload, JWT_SECRET, options);

    res.json({
      message: "Login realizado com sucesso",
      token,
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

export default router;
