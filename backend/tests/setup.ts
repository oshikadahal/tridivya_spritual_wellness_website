import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDatabase, disconnectDatabase } from '../src/database/mongodb';

let mongo: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.MONGODB_URI = uri;
  await connectDatabase(uri);
});

afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await disconnectDatabase();
  if (mongo) {
    await mongo.stop();
  }
});
