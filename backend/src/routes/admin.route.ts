import { Router } from 'express';
import { AdminUserController } from '../controllers/admin-user.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { uploads, videoUploads } from '../middlewares/upload.middleware';
import { bookingController } from '../controllers/booking.controller';

const adminUserController = new AdminUserController();
const router = Router();

// All routes require authentication and admin role
router.use(authorizedMiddleware);
router.use(adminMiddleware);

// POST /api/admin/users - Create user with image upload
router.post('/users', uploads.single('imageUrl'), adminUserController.createUser);

// GET /api/admin/dashboard/overview - Admin dashboard overview stats
router.get('/dashboard/overview', adminUserController.getAdminOverviewStats.bind(adminUserController));

// Review Routes - Admin review management
router.get('/reviews', adminUserController.getAllReviews.bind(adminUserController));
router.post('/reviews/:type/:contentId', adminUserController.createReview.bind(adminUserController));
router.patch('/reviews/:type/:contentId/:reviewId', adminUserController.updateReview.bind(adminUserController));
router.delete('/reviews/:type/:contentId/:reviewId', adminUserController.deleteReview.bind(adminUserController));

// POST /api/admin/uploads/image - Upload image for content items
router.post('/uploads/image', uploads.single('image'), adminUserController.uploadImage);

// POST /api/admin/uploads/video - Upload video for content items
router.post('/uploads/video', videoUploads.single('video'), adminUserController.uploadVideo);

// GET /api/admin/users - Get all users
router.get('/users', adminUserController.getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', adminUserController.getUserById);

// PUT /api/admin/users/:id - Update user with image upload
router.put('/users/:id', uploads.single('imageUrl'), adminUserController.updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminUserController.deleteUser);

// Booking Routes - Admin Booking Management
router.get('/bookings', bookingController.getAllBookings.bind(bookingController));
router.post('/bookings', bookingController.adminCreateBooking.bind(bookingController));
router.put('/bookings/:id', bookingController.adminUpdateBooking.bind(bookingController));
router.patch('/bookings/:id/status', bookingController.adminUpdateBookingStatus.bind(bookingController));
router.delete('/bookings/:id', bookingController.adminDeleteBooking.bind(bookingController));

// Profile Routes - Admin Profile Management
// GET /api/admin/profile - Get current admin profile
router.get('/profile', adminUserController.getAdminProfile);

// PUT /api/admin/profile - Update admin profile with image upload
router.put('/profile', uploads.single('imageUrl'), adminUserController.updateAdminProfile);

// DELETE /api/admin/profile/picture - Delete admin profile picture
router.delete('/profile/picture', adminUserController.deleteAdminProfilePicture);

export default router;
