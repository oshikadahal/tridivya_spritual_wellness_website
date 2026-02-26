import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { resolveCollectionName } from '../utils/collection-name';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all_levels';

export interface IYoga extends Document {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  difficulty: Difficulty;
  duration_seconds?: number;
  thumbnail_url?: string;
  cover_image_url?: string;
  media_url?: string;
  goal_slug?: string;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  accent_label?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

const YogaSchema = new Schema<IYoga>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: false },
    description: { type: String, required: false },
    image_url: { type: String, required: false },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
      default: 'all_levels',
      required: true,
    },
    duration_seconds: { type: Number, min: 0, required: false },
    thumbnail_url: { type: String, required: false },
    cover_image_url: { type: String, required: false },
    media_url: { type: String, required: false },
    goal_slug: { type: String, required: false, index: true },
    is_featured: { type: Boolean, default: false },
    is_trending: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true, index: true },
    accent_label: { type: String, required: false },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    collection: resolveCollectionName('yogas'),
  }
);

YogaSchema.index({ goal_slug: 1, is_featured: 1, is_active: 1 });

export const YogaModel = mongoose.model<IYoga>('Yoga', YogaSchema);
