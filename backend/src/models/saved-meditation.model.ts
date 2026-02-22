import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface ISavedMeditation extends Document {
  user_id: string;
  meditation_id: string;
  saved_at: Date;
}

const SavedMeditationSchema = new Schema<ISavedMeditation>(
  {
    user_id: { type: String, required: true, index: true },
    meditation_id: { type: String, required: true, index: true },
    saved_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('saved_meditations'),
  }
);

SavedMeditationSchema.index({ user_id: 1, meditation_id: 1 }, { unique: true });

export const SavedMeditationModel = mongoose.model<ISavedMeditation>('SavedMeditation', SavedMeditationSchema);
