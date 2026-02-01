import express from 'express';
import { PORT } from './config';
import { connectDatabase } from './database/mongodb';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import cors from 'cors';
import path from 'path';

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3003"],
  credentials: true,
};

app.use(cors(corsOptions));

// Parse JSON and URL-encoded data FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
