import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface ISavedSession extends Document {
  user_id: string;
  session_id: string;
  saved_at: Date;
}

const SavedSessionSchema = new Schema<ISavedSession>(
  {
    user_id: { type: String, required: true, index: true },
    session_id: { type: String, required: true, index: true },
    saved_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('saved_sessions'),
  }
);

SavedSessionSchema.index({ user_id: 1, session_id: 1 }, { unique: true });

export const SavedSessionModel = mongoose.model<ISavedSession>('SavedSession', SavedSessionSchema);
