import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface IUserMantraProgress extends Document {
  user_id: string;
  mantra_id: string;
  times_practiced: number;
  last_practiced_at?: Date;
  updated_at: Date;
}

const UserMantraProgressSchema = new Schema<IUserMantraProgress>(
  {
    user_id: { type: String, required: true, index: true },
    mantra_id: { type: String, required: true, index: true },
    times_practiced: { type: Number, min: 0, default: 0, required: true },
    last_practiced_at: { type: Date, required: false },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_mantra_progress'),
  }
);

UserMantraProgressSchema.index({ user_id: 1, mantra_id: 1 }, { unique: true });

export const UserMantraProgressModel = mongoose.model<IUserMantraProgress>('UserMantraProgress', UserMantraProgressSchema);
