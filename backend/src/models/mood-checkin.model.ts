import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export type MoodCode = 'calm' | 'stressed' | 'tired' | 'energized' | 'focused' | 'distracted' | 'anxious' | 'happy' | 'sad' | 'neutral';

export interface IMoodCheckin extends Document {
  id: string;
  user_id: string;
  mood_code: MoodCode;
  created_at: Date;
  updated_at: Date;
}

const MoodCheckinSchema = new Schema<IMoodCheckin>(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    mood_code: {
      type: String,
      enum: ['calm', 'stressed', 'tired', 'energized', 'focused', 'distracted', 'anxious', 'happy', 'sad', 'neutral'],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'mood_checkins',
  }
);

export const MoodCheckinModel = mongoose.model<IMoodCheckin>(
  'MoodCheckin',
  MoodCheckinSchema,
  'mood_checkins'
);
