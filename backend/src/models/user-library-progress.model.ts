import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface IUserLibraryProgress extends Document {
  user_id: string;
  library_item_id: string;
  progress_percent: number;
  status: ProgressStatus;
  last_read_at?: Date;
  updated_at: Date;
}

const UserLibraryProgressSchema = new Schema<IUserLibraryProgress>(
  {
    user_id: { type: String, required: true, index: true },
    library_item_id: { type: String, required: true, index: true },
    progress_percent: { type: Number, min: 0, max: 100, default: 0, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started', required: true },
    last_read_at: { type: Date, required: false },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_library_progress'),
  }
);

UserLibraryProgressSchema.index({ user_id: 1, library_item_id: 1 }, { unique: true });

export const UserLibraryProgressModel = mongoose.model<IUserLibraryProgress>('UserLibraryProgress', UserLibraryProgressSchema);
