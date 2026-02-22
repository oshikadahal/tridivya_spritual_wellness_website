import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDatabase, disconnectDatabase } from '../src/database/mongodb';

let mongo: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const baseUri = mongo.getUri();
  const dbName = process.env.TEST_DB_NAME || 'tridivya_wellness_test';
  const url = new URL(baseUri);
  url.pathname = `/${dbName}`;
  const testUri = url.toString();

  process.env.MONGODB_URI = testUri;
  await connectDatabase(testUri);
});

afterEach(async () => {
  const shouldClearEachTest = process.env.TEST_CLEAR_DB_EACH_TEST === 'true';
  if (shouldClearEachTest && mongoose.connection.readyState === 1) {
    await mongoose.connection.db.dropDatabase();
  }
});

afterAll(async () => {
  await disconnectDatabase();
  if (mongo) {
    await mongo.stop();
  }
});
