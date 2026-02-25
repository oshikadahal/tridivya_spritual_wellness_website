import { userSettingsRepository } from '../repositories/user-settings.repository';
import { IUserSettings } from '../models/user-settings.model';
import { HttpError } from '../errors/http-error';

export class UserSettingsService {
  async getSettings(userId: string): Promise<IUserSettings> {
    try {
      let settings = await userSettingsRepository.getSettingsByUserId(userId);

      // Create default settings if not exist
      if (!settings) {
        settings = await userSettingsRepository.createSettings(userId, {});
      }

      return settings;
    } catch (error) {
      throw new HttpError(500, 'Failed to fetch settings');
    }
  }

  async updateSettings(userId: string, updates: Partial<IUserSettings>): Promise<IUserSettings> {
    try {
      // Ensure settings exist
      let settings = await userSettingsRepository.getSettingsByUserId(userId);
      if (!settings) {
        settings = await userSettingsRepository.createSettings(userId, {});
      }

      const updatedSettings = await userSettingsRepository.updateSettings(userId, updates);

      if (!updatedSettings) {
        throw new HttpError(404, 'Settings not found');
      }

      return updatedSettings;
    } catch (error: any) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(500, 'Failed to update settings');
    }
  }

  async updateGeneralSettings(
    userId: string,
    data: {
      language?: string;
      timezone?: string;
    }
  ): Promise<IUserSettings> {
    return this.updateSettings(userId, {
      language: data.language,
      timezone: data.timezone,
    });
  }

  async updatePrivacySettings(
    userId: string,
    data: {
      profileVisibility?: 'public' | 'private';
      reviewVisibility?: boolean;
      progressVisibility?: boolean;
      savedContentVisibility?: boolean;
      showActivity?: boolean;
    }
  ): Promise<IUserSettings> {
    return this.updateSettings(userId, data);
  }

  async updateNotificationSettings(
    userId: string,
    data: {
      emailNotifications?: boolean;
      notificationFrequency?: 'instant' | 'daily' | 'weekly' | 'never';
      notifyAchievements?: boolean;
      notifyRecommendations?: boolean;
      notifyAnnouncements?: boolean;
    }
  ): Promise<IUserSettings> {
    return this.updateSettings(userId, data);
  }

  async updateAppearanceSettings(
    userId: string,
    data: {
      theme?: 'light' | 'dark' | 'auto';
      accentColor?: string;
      fontSize?: 'small' | 'medium' | 'large';
      reduceMotion?: boolean;
    }
  ): Promise<IUserSettings> {
    return this.updateSettings(userId, data);
  }

  async updateDataPreferences(userId: string, dataCollection: boolean): Promise<IUserSettings> {
    return this.updateSettings(userId, { dataCollection });
  }
}

export const userSettingsService = new UserSettingsService();
