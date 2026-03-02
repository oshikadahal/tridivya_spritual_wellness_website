import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';
import { resolveCollectionName } from '../utils/collection-name';

export type LibraryType = 'book' | 'article' | 'resource';

export interface ILibraryItem extends Document {
  id: string;
  library_type: LibraryType;
  title: string;
  author_name?: string;
  description?: string;
  content_text?: string;
  read_minutes?: number;
  cover_image_url?: string;
  content_url?: string;
  thumbnail_url?: string;
  category_slug?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const LibraryItemSchema = new Schema<ILibraryItem>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    library_type: { type: String, enum: ['book', 'article', 'resource'], required: true },
    title: { type: String, required: true, trim: true },
    author_name: { type: String, required: false },
    description: { type: String, required: false },
    content_text: { type: String, required: false },
    read_minutes: { type: Number, min: 0, required: false },
    cover_image_url: { type: String, required: false },
    content_url: { type: String, required: false },
    thumbnail_url: { type: String, required: false },
    category_slug: { type: String, required: false, index: true },
    is_featured: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    collection: resolveCollectionName('library_items'),
  }
);

LibraryItemSchema.index({ library_type: 1, category_slug: 1, is_active: 1 });

export const LibraryItemModel = mongoose.model<ILibraryItem>('LibraryItem', LibraryItemSchema);
