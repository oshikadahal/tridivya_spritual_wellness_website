import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';
import crypto from 'crypto';

export interface IUserMeditationReview extends Document {
  id: string;
  user_id: string;
  meditation_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const UserMeditationReviewSchema = new Schema<IUserMeditationReview>(
  {
    id: { type: String, default: () => crypto.randomUUID(), required: true, unique: true },
    user_id: { type: String, required: true, index: true },
    meditation_id: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_meditation_reviews'),
  }
);

UserMeditationReviewSchema.index({ user_id: 1, meditation_id: 1 }, { unique: true });
UserMeditationReviewSchema.index({ meditation_id: 1, created_at: -1 });

export const UserMeditationReviewModel = mongoose.model<IUserMeditationReview>('UserMeditationReview', UserMeditationReviewSchema);
