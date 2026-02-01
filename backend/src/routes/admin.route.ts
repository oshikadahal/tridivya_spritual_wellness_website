import { Router } from 'express';
import { AdminUserController } from '../controllers/admin-user.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';
import { uploads } from '../middlewares/upload.middleware';

const adminUserController = new AdminUserController();
const router = Router();

// All routes require authentication and admin role
router.use(authorizedMiddleware);
router.use(adminMiddleware);

// POST /api/admin/users - Create user with image upload
router.post('/users', uploads.single('imageUrl'), adminUserController.createUser);

// GET /api/admin/users - Get all users
router.get('/users', adminUserController.getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get('/users/:id', adminUserController.getUserById);

// PUT /api/admin/users/:id - Update user with image upload
router.put('/users/:id', uploads.single('imageUrl'), adminUserController.updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminUserController.deleteUser);

export default router;
