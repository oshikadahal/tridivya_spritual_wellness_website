import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export type SessionProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface IUserSessionProgress extends Document {
  user_id: string;
  session_id: string;
  progress_percent: number;
  status: SessionProgressStatus;
  last_position_seconds: number;
  started_at?: Date;
  completed_at?: Date;
  updated_at: Date;
}

const UserSessionProgressSchema = new Schema<IUserSessionProgress>(
  {
    user_id: { type: String, required: true, index: true },
    session_id: { type: String, required: true, index: true },
    progress_percent: { type: Number, min: 0, max: 100, default: 0, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started', required: true },
    last_position_seconds: { type: Number, min: 0, default: 0, required: true },
    started_at: { type: Date, required: false },
    completed_at: { type: Date, required: false },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_session_progress'),
  }
);

UserSessionProgressSchema.index({ user_id: 1, session_id: 1 }, { unique: true });

export const UserSessionProgressModel = mongoose.model<IUserSessionProgress>('UserSessionProgress', UserSessionProgressSchema);
