import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();

// ✅ CORS configurado para permitir seu frontend do Netlify
app.use(cors({
  origin: 'https://todolisttyscript.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Garante que o Express responda a requisições OPTIONS (pré-flight)
app.options('*', cors());

app.use(express.json());

// ✅ Conexão com MongoDB
connectDB();

// ✅ Rotas da API
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// ✅ Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

