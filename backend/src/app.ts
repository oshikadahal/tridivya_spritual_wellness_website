import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';

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

export default app;
