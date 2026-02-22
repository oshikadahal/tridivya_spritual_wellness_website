import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';
import crypto from 'crypto';

export interface IUserMantraReview extends Document {
  id: string;
  user_id: string;
  mantra_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const UserMantraReviewSchema = new Schema<IUserMantraReview>(
  {
    id: { type: String, default: () => crypto.randomUUID(), required: true, unique: true },
    user_id: { type: String, required: true, index: true },
    mantra_id: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_mantra_reviews'),
  }
);

UserMantraReviewSchema.index({ user_id: 1, mantra_id: 1 }, { unique: true });
UserMantraReviewSchema.index({ mantra_id: 1, created_at: -1 });

export const UserMantraReviewModel = mongoose.model<IUserMantraReview>('UserMantraReview', UserMantraReviewSchema);
