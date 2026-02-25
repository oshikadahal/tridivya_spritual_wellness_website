import { Request, Response } from 'express';
import { userSettingsService } from '../services/user-settings.service';

export class UserSettingsController {
  /**
   * Get user settings
   * GET /api/me/settings
   */
  async getSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const settings = await userSettingsService.getSettings(userId);

      return res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to fetch settings',
      });
    }
  }

  /**
   * Update user settings
   * PUT /api/me/settings
   */
  async updateSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const updates = req.body;
      const settings = await userSettingsService.updateSettings(userId, updates);

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Settings updated successfully',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update settings',
      });
    }
  }

  /**
   * Update general settings
   * PUT /api/me/settings/general
   */
  async updateGeneralSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { language, timezone } = req.body;
      const settings = await userSettingsService.updateGeneralSettings(userId, {
        language,
        timezone,
      });

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'General settings updated',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update general settings',
      });
    }
  }

  /**
   * Update privacy settings
   * PUT /api/me/settings/privacy
   */
  async updatePrivacySettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const settings = await userSettingsService.updatePrivacySettings(userId, req.body);

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Privacy settings updated',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update privacy settings',
      });
    }
  }

  /**
   * Update notification settings
   * PUT /api/me/settings/notifications
   */
  async updateNotificationSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const settings = await userSettingsService.updateNotificationSettings(userId, req.body);

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Notification settings updated',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update notification settings',
      });
    }
  }

  /**
   * Update appearance settings
   * PUT /api/me/settings/appearance
   */
  async updateAppearanceSettings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const settings = await userSettingsService.updateAppearanceSettings(userId, req.body);

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Appearance settings updated',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update appearance settings',
      });
    }
  }

  /**
   * Update data preferences
   * PUT /api/me/settings/data
   */
  async updateDataPreferences(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { dataCollection } = req.body;

      if (typeof dataCollection !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'dataCollection must be a boolean',
        });
      }

      const settings = await userSettingsService.updateDataPreferences(userId, dataCollection);

      return res.status(200).json({
        success: true,
        data: settings,
        message: 'Data preferences updated',
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update data preferences',
      });
    }
  }
}

export default UserSettingsController;
