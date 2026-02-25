import { UserSettingsModel, IUserSettings } from '../models/user-settings.model';
import mongoose from 'mongoose';

export class UserSettingsRepository {
  async getSettingsByUserId(userId: string): Promise<IUserSettings | null> {
    return await UserSettingsModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  }

  async createSettings(userId: string, settings: Partial<IUserSettings>): Promise<IUserSettings> {
    return await UserSettingsModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...settings,
    });
  }

  async updateSettings(userId: string, updates: Partial<IUserSettings>): Promise<IUserSettings | null> {
    return await UserSettingsModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      updates,
      { new: true }
    );
  }

  async deleteSettings(userId: string): Promise<boolean> {
    const result = await UserSettingsModel.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }
}

export const userSettingsRepository = new UserSettingsRepository();
