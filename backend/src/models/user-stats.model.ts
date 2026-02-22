import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface IUserStats extends Document {
  user_id: string;
  total_sessions_completed: number;
  total_meditation_minutes: number;
  total_yoga_minutes: number;
  total_mantras_practiced: number;
  current_streak_days: number;
  longest_streak_days: number;
  updated_at: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    total_sessions_completed: { type: Number, default: 0, min: 0 },
    total_meditation_minutes: { type: Number, default: 0, min: 0 },
    total_yoga_minutes: { type: Number, default: 0, min: 0 },
    total_mantras_practiced: { type: Number, default: 0, min: 0 },
    current_streak_days: { type: Number, default: 0, min: 0 },
    longest_streak_days: { type: Number, default: 0, min: 0 },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_stats'),
  }
);

export const UserStatsModel = mongoose.model<IUserStats>('UserStats', UserStatsSchema);
