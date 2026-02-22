import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface IUserMeditationProgress extends Document {
  user_id: string;
  meditation_id: string;
  progress_percent: number;
  status: ProgressStatus;
  last_position_seconds: number;
  started_at?: Date;
  completed_at?: Date;
  last_played_at?: Date;
  updated_at: Date;
}

const UserMeditationProgressSchema = new Schema<IUserMeditationProgress>(
  {
    user_id: { type: String, required: true, index: true },
    meditation_id: { type: String, required: true, index: true },
    progress_percent: { type: Number, min: 0, max: 100, default: 0, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started', required: true },
    last_position_seconds: { type: Number, min: 0, default: 0, required: true },
    started_at: { type: Date, required: false },
    completed_at: { type: Date, required: false },
    last_played_at: { type: Date, required: false },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_meditation_progress'),
  }
);

UserMeditationProgressSchema.index({ user_id: 1, meditation_id: 1 }, { unique: true });

export const UserMeditationProgressModel = mongoose.model<IUserMeditationProgress>('UserMeditationProgress', UserMeditationProgressSchema);
