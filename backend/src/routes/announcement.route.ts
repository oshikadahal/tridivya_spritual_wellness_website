import { Router } from 'express';
import { announcementController } from '../controllers/announcement.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = Router();

// Public announcements (published only)
router.get('/public/list', announcementController.findPublished.bind(announcementController));

// Admin announcement management
router.post('/', authorizedMiddleware, adminMiddleware, announcementController.create.bind(announcementController));
router.get('/', authorizedMiddleware, adminMiddleware, announcementController.findAll.bind(announcementController));
router.get('/:id', authorizedMiddleware, adminMiddleware, announcementController.findById.bind(announcementController));
router.patch('/:id', authorizedMiddleware, adminMiddleware, announcementController.update.bind(announcementController));
router.delete('/:id', authorizedMiddleware, adminMiddleware, announcementController.delete.bind(announcementController));
router.post('/:id/publish', authorizedMiddleware, adminMiddleware, announcementController.publish.bind(announcementController));

export default router;
