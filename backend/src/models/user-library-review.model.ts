import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';
import crypto from 'crypto';

export interface IUserLibraryReview extends Document {
  id: string;
  user_id: string;
  library_item_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

const UserLibraryReviewSchema = new Schema<IUserLibraryReview>(
  {
    id: { type: String, default: () => crypto.randomUUID(), required: true, unique: true },
    user_id: { type: String, required: true, index: true },
    library_item_id: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: false },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('user_library_reviews'),
  }
);

UserLibraryReviewSchema.index({ user_id: 1, library_item_id: 1 }, { unique: true });
UserLibraryReviewSchema.index({ library_item_id: 1, created_at: -1 });

export const UserLibraryReviewModel = mongoose.model<IUserLibraryReview>('UserLibraryReview', UserLibraryReviewSchema);
