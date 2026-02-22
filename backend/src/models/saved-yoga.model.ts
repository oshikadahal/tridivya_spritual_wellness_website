import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface ISavedYoga extends Document {
  user_id: string;
  yoga_id: string;
  saved_at: Date;
}

const SavedYogaSchema = new Schema<ISavedYoga>(
  {
    user_id: { type: String, required: true, index: true },
    yoga_id: { type: String, required: true, index: true },
    saved_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('saved_yogas'),
  }
);

SavedYogaSchema.index({ user_id: 1, yoga_id: 1 }, { unique: true });

export const SavedYogaModel = mongoose.model<ISavedYoga>('SavedYoga', SavedYogaSchema);
