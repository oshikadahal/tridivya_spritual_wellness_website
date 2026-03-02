import mongoose, { Document, Schema, Types } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';
import crypto from 'crypto';

export interface IUserYogaReview extends Document {
  id: string;
  user_id: Types.ObjectId; // must match schema for population
  yoga_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const UserYogaReviewSchema = new Schema<IUserYogaReview>(
  {
    id: { type: String, default: () => crypto.randomUUID(), required: true, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    yoga_id: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_yoga_reviews'),
  }
);

UserYogaReviewSchema.index({ user_id: 1, yoga_id: 1 }, { unique: true });
UserYogaReviewSchema.index({ yoga_id: 1, created_at: -1 });

export const UserYogaReviewModel = mongoose.model<IUserYogaReview>('UserYogaReview', UserYogaReviewSchema);
