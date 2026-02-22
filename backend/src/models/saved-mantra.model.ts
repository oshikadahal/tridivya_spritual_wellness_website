import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface ISavedMantra extends Document {
  user_id: string;
  mantra_id: string;
  saved_at: Date;
}

const SavedMantraSchema = new Schema<ISavedMantra>(
  {
    user_id: { type: String, required: true, index: true },
    mantra_id: { type: String, required: true, index: true },
    saved_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('saved_mantras'),
  }
);

SavedMantraSchema.index({ user_id: 1, mantra_id: 1 }, { unique: true });

export const SavedMantraModel = mongoose.model<ISavedMantra>('SavedMantra', SavedMantraSchema);
