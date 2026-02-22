import mongoose, { Document, Schema } from 'mongoose';
import { resolveCollectionName } from '../utils/collection-name';

export interface ISavedLibraryItem extends Document {
  user_id: string;
  library_item_id: string;
  saved_at: Date;
}

const SavedLibraryItemSchema = new Schema<ISavedLibraryItem>(
  {
    user_id: { type: String, required: true, index: true },
    library_item_id: { type: String, required: true, index: true },
    saved_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
    collection: resolveCollectionName('saved_library_items'),
  }
);

SavedLibraryItemSchema.index({ user_id: 1, library_item_id: 1 }, { unique: true });

export const SavedLibraryItemModel = mongoose.model<ISavedLibraryItem>('SavedLibraryItem', SavedLibraryItemSchema);
