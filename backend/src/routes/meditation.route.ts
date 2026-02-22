import { Router } from 'express';
import { meditationController } from '../controllers/meditation.controller';
import { meController } from '../controllers/me.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Public meditation endpoints
router.get('/', meditationController.findAll.bind(meditationController));
router.get('/:id', meditationController.findById.bind(meditationController));

// Admin meditation management
router.post('/', authorizedMiddleware, adminMiddleware, meditationController.create.bind(meditationController));
router.patch('/:id', authorizedMiddleware, adminMiddleware, meditationController.update.bind(meditationController));
router.delete('/:id', authorizedMiddleware, adminMiddleware, meditationController.delete.bind(meditationController));

// Meditation reviews (as per schema: /api/v1/meditations/{meditation_id}/reviews)
router.get('/:id/reviews', meController.getMeditationReviews.bind(meController));
router.post('/:id/reviews', authorizedMiddleware, meController.createMeditationReview.bind(meController));
router.patch('/:id/reviews/:review_id', authorizedMiddleware, meController.updateMeditationReview.bind(meController));
router.delete('/:id/reviews/:review_id', authorizedMiddleware, meController.deleteMeditationReview.bind(meController));

export default router;
