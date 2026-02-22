import { Router } from 'express';
import { mantraController } from '../controllers/mantra.controller';
import { meController } from '../controllers/me.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Public mantra endpoints
router.get('/', mantraController.findAll.bind(mantraController));
router.get('/:id', mantraController.findById.bind(mantraController));

// Admin mantra management
router.post('/', authorizedMiddleware, adminMiddleware, mantraController.create.bind(mantraController));
router.patch('/:id', authorizedMiddleware, adminMiddleware, mantraController.update.bind(mantraController));
router.delete('/:id', authorizedMiddleware, adminMiddleware, mantraController.delete.bind(mantraController));

// Mantra reviews (as per schema: /api/v1/mantras/{mantra_id}/reviews)
router.get('/:id/reviews', meController.getMantraReviews.bind(meController));
router.post('/:id/reviews', authorizedMiddleware, meController.createMantraReview.bind(meController));
router.patch('/:id/reviews/:review_id', authorizedMiddleware, meController.updateMantraReview.bind(meController));
router.delete('/:id/reviews/:review_id', authorizedMiddleware, meController.deleteMantraReview.bind(meController));

export default router;
