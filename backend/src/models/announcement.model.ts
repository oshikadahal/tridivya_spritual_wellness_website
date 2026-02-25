import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export type AnnouncementStatus = 'draft' | 'scheduled' | 'published';
export type AnnouncementTone = 'calm' | 'empower' | 'celebrate';

export interface IAnnouncement extends Document {
  id: string;
  title: string;
  message: string;
  tone: AnnouncementTone;
  status: AnnouncementStatus;
  scheduled_at?: Date;
  published_at?: Date;
  created_by: string; // admin user ID
  updated_by?: string; // admin user ID
  created_at: Date;
  updated_at: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    id: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    tone: {
      type: String,
      enum: ['calm', 'empower', 'celebrate'],
      required: true,
      default: 'calm',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      required: true,
      default: 'draft',
      index: true,
    },
    scheduled_at: {
      type: Date,
      required: false,
      index: true,
    },
    published_at: {
      type: Date,
      required: false,
    },
    created_by: {
      type: String,
      required: true,
      index: true,
    },
    updated_by: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'announcements',
  }
);

export const AnnouncementModel = mongoose.model<IAnnouncement>(
  'Announcement',
  AnnouncementSchema,
  'announcements'
);
