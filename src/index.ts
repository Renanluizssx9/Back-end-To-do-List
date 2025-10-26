import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
