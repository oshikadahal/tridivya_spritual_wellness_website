import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGO_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/tridivya_wellness';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
