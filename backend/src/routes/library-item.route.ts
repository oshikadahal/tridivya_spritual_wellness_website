import { Router } from 'express';
import { LibraryItemController } from '../controllers/library-item.controller';
import { meController } from '../controllers/me.controller';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { uploads } from '../middlewares/upload.middleware';
import { documentUploads } from '../middlewares/upload.middleware';

const router = Router();
const libraryItemController = new LibraryItemController();

// Public library endpoints
router.get('/', libraryItemController.list);
router.get('/:library_item_id', libraryItemController.getById);

// Admin library management
router.post('/upload-image', authorizedMiddleware, adminMiddleware, uploads.single('cover_image'), libraryItemController.uploadImage.bind(libraryItemController));
router.post('/upload-content', authorizedMiddleware, adminMiddleware, documentUploads.single('content_file'), libraryItemController.uploadContent.bind(libraryItemController));
router.post('/', authorizedMiddleware, adminMiddleware, uploads.single('cover_image'), libraryItemController.create.bind(libraryItemController));
router.patch('/:library_item_id', authorizedMiddleware, adminMiddleware, uploads.single('cover_image'), libraryItemController.update.bind(libraryItemController));
router.delete('/:library_item_id', authorizedMiddleware, adminMiddleware, libraryItemController.remove);

// Library reviews (as per schema: /api/v1/library/{library_item_id}/reviews)
router.get('/:library_item_id/reviews', meController.getLibraryReviews.bind(meController));
router.post('/:library_item_id/reviews', authorizedMiddleware, meController.createLibraryReview.bind(meController));
router.patch('/:library_item_id/reviews/:review_id', authorizedMiddleware, meController.updateLibraryReview.bind(meController));
router.delete('/:library_item_id/reviews/:review_id', authorizedMiddleware, meController.deleteLibraryReview.bind(meController));

export default router;
