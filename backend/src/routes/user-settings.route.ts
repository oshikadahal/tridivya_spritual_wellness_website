import { Router } from 'express';
import UserSettingsController from '../controllers/user-settings.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';

const router = Router();
const userSettingsController = new UserSettingsController();

// All routes require authentication
router.use(authorizedMiddleware);

// Get all user settings
router.get('/', (req, res) => userSettingsController.getSettings(req, res));

// Update all settings at once
router.put('/', (req, res) => userSettingsController.updateSettings(req, res));

// Update specific setting categories
router.put('/general', (req, res) => userSettingsController.updateGeneralSettings(req, res));
router.put('/privacy', (req, res) => userSettingsController.updatePrivacySettings(req, res));
router.put('/notifications', (req, res) => userSettingsController.updateNotificationSettings(req, res));
router.put('/appearance', (req, res) => userSettingsController.updateAppearanceSettings(req, res));
router.put('/data', (req, res) => userSettingsController.updateDataPreferences(req, res));

export default router;
