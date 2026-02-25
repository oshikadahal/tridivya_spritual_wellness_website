import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard/dashboard.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';

const router = Router();

// All dashboard endpoints require authentication
router.use(authorizedMiddleware);

// Statistics
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// Mood checkins
router.post('/mood-checkin', dashboardController.createMoodCheckin.bind(dashboardController));
router.get('/mood-checkins', dashboardController.getMoodCheckins.bind(dashboardController));
router.get('/mood-summary', dashboardController.getMoodSummary.bind(dashboardController));

// Personalized content
router.get('/recommendations', dashboardController.getRecommendations.bind(dashboardController));
router.get('/trending', dashboardController.getTrending.bind(dashboardController));

// Activity
router.get('/recent-activity', dashboardController.getRecentActivity.bind(dashboardController));

export default router;
