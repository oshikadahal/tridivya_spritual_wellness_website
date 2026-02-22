import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';

const router = Router();
const sessionController = new SessionController();

router.get('/', sessionController.list);
router.get('/:session_id', sessionController.getById);
router.get('/:session_id/reviews', sessionController.listReviews);

router.post('/', authorizedMiddleware, adminMiddleware, sessionController.create);
router.patch('/:session_id', authorizedMiddleware, adminMiddleware, sessionController.update);
router.delete('/:session_id', authorizedMiddleware, adminMiddleware, sessionController.remove);

router.post('/:session_id/reviews', authorizedMiddleware, sessionController.createReview);
router.patch('/:session_id/reviews/:review_id', authorizedMiddleware, sessionController.updateReview);
router.delete('/:session_id/reviews/:review_id', authorizedMiddleware, sessionController.removeReview);

export default router;
