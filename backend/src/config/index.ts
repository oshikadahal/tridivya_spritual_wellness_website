import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory (one level up from backend)
dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGO_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/tridivya_wellness';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
