import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  
  // General Settings
  language: string;
  timezone: string;
  
  // Privacy Settings
  profileVisibility: 'public' | 'private';
  reviewVisibility: boolean;
  progressVisibility: boolean;
  savedContentVisibility: boolean;
  showActivity: boolean;
  
  // Notification Settings
  emailNotifications: boolean;
  notificationFrequency: 'instant' | 'daily' | 'weekly' | 'never';
  notifyAchievements: boolean;
  notifyRecommendations: boolean;
  notifyAnnouncements: boolean;
  
  // Appearance Settings
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  
  // Data Preferences
  dataCollection: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'hi'],
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    reviewVisibility: {
      type: Boolean,
      default: true,
    },
    progressVisibility: {
      type: Boolean,
      default: true,
    },
    savedContentVisibility: {
      type: Boolean,
      default: true,
    },
    showActivity: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    notificationFrequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly', 'never'],
      default: 'daily',
    },
    notifyAchievements: {
      type: Boolean,
      default: true,
    },
    notifyRecommendations: {
      type: Boolean,
      default: true,
    },
    notifyAnnouncements: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
    accentColor: {
      type: String,
      default: 'indigo',
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    reduceMotion: {
      type: Boolean,
      default: false,
    },
    dataCollection: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'user_settings',
  }
);

// Index for faster queries
UserSettingsSchema.index({ userId: 1 });

export const UserSettingsModel = mongoose.model<IUserSettings>(
  'UserSettings',
  UserSettingsSchema
);
