import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { resolveCollectionName } from '../utils/collection-name';

export interface IUserSessionReview extends Document {
  id: string;
  user_id: string;
  session_id: string;
  rating: number;
  title?: string;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const UserSessionReviewSchema = new Schema<IUserSessionReview>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    user_id: { type: String, required: true, index: true },
    session_id: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, required: false },
    comment: { type: String, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    collection: resolveCollectionName('user_session_reviews'),
  }
);

UserSessionReviewSchema.index({ user_id: 1, session_id: 1 }, { unique: true });

export const UserSessionReviewModel = mongoose.model<IUserSessionReview>('UserSessionReview', UserSessionReviewSchema);
