import { Router } from 'express';
import { yogaController } from '../controllers/yoga.controller';
import { meController } from '../controllers/me.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Public yoga endpoints
router.get('/', yogaController.findAll.bind(yogaController));
router.get('/:id', yogaController.findById.bind(yogaController));

// Admin yoga management
router.post('/', authorizedMiddleware, adminMiddleware, yogaController.create.bind(yogaController));
router.patch('/:id', authorizedMiddleware, adminMiddleware, yogaController.update.bind(yogaController));
router.delete('/:id', authorizedMiddleware, adminMiddleware, yogaController.delete.bind(yogaController));

// Yoga reviews (as per schema: /api/v1/yogas/{yoga_id}/reviews)
router.get('/:id/reviews', meController.getYogaReviews.bind(meController));
router.post('/:id/reviews', authorizedMiddleware, meController.createYogaReview.bind(meController));
router.patch('/:id/reviews/:review_id', authorizedMiddleware, meController.updateYogaReview.bind(meController));
router.delete('/:id/reviews/:review_id', authorizedMiddleware, meController.deleteYogaReview.bind(meController));

export default router;
