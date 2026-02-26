import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { resolveCollectionName } from '../utils/collection-name';

export interface IMantra extends Document {
  id: string;
  title: string;
  image_url?: string;
  meaning?: string;
  lyrics?: string;
  transliteration?: string;
  pronunciation_guide?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  cover_image_url?: string;
  audio_url?: string;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  accent_label?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

const MantraSchema = new Schema<IMantra>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    title: { type: String, required: true, trim: true },
    image_url: { type: String, required: false },
    meaning: { type: String, required: false },
    lyrics: { type: String, required: false },
    transliteration: { type: String, required: false },
    pronunciation_guide: { type: String, required: false },
    duration_seconds: { type: Number, min: 0, required: false },
    thumbnail_url: { type: String, required: false },
    cover_image_url: { type: String, required: false },
    audio_url: { type: String, required: false },
    is_featured: { type: Boolean, default: false },
    is_trending: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true, index: true },
    accent_label: { type: String, required: false },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    collection: resolveCollectionName('mantras'),
  }
);

MantraSchema.index({ is_featured: 1, is_active: 1 });

export const MantraModel = mongoose.model<IMantra>('Mantra', MantraSchema);
