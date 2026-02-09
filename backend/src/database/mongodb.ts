import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export async function connectDatabase(uri?: string) {
  const connectionUri = uri || MONGO_URI;
  try {
    await mongoose.connect(connectionUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
