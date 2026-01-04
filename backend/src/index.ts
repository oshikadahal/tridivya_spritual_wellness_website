import express from 'express';
import { PORT } from './config';
import { connectDatabase } from './database/mongodb';
import authRoutes from './routes/auth.route';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
