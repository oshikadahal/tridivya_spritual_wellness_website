import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory (one level up from backend)
dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

export const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 5050;
export const MONGO_URI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/tridivya_wellness';
export const JWT_SECRET: string = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
export const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:3000';

export const SMTP_HOST: string | undefined = process.env.SMTP_HOST;
export const SMTP_PORT: number = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
export const SMTP_USER: string | undefined = process.env.SMTP_USER;
export const SMTP_PASS: string | undefined = process.env.SMTP_PASS;
export const SMTP_FROM: string = process.env.SMTP_FROM || 'no-reply@tridivya.local';
