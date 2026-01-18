import express from 'express';
import { PORT } from './config';
import { connectDatabase } from './database/mongodb';
import authRoutes from './routes/auth.route';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3003"],
  //which url can access backend
  //put your frontend domain /url here
  //origin: "*" //yo le sabai url lai access dincha
};

app.use(cors(corsOptions));
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
