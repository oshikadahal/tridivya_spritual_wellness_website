import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import homeRoutes from './routes/home.route';
import meditationRoutes from './routes/meditation.route';
import yogaRoutes from './routes/yoga.route';
import mantraRoutes from './routes/mantra.route';
import libraryItemRoutes from './routes/library-item.route';
import meRoutes from './routes/me.route';

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000","http://localhost:3001", "http://localhost:3003"],
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
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/meditations', meditationRoutes);
app.use('/api/v1/yogas', yogaRoutes);
app.use('/api/v1/mantras', mantraRoutes);
app.use('/api/v1/library-items', libraryItemRoutes);
app.use('/api/v1/me', meRoutes);

export default app;
