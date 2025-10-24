import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database";
import taskRoutes from "./routes/tasks";

dotenv.config(); 

const app = express();
app.use(express.json());

connectDB();
app.use(cors());
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
