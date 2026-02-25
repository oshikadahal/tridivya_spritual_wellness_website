import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {authorizedMiddleware} from '../middlewares/authorization.middleware';
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', authorizedMiddleware, authController.changePassword);

// Get current user profile
router.get('/profile', authorizedMiddleware, authController.getProfile);
router.get('/whoami', authorizedMiddleware, authController.getProfile);

// Upload profile picture - accepts imageUrl field from frontend
router.put('/profile', authorizedMiddleware, uploads.single('imageUrl'), authController.updateProfile);
router.put("/whoiam", authorizedMiddleware, uploads.single("imageUrl"), authController.updateProfile);
router.put(
    "/update-profile",
    authorizedMiddleware,
    uploads.single("imageUrl"),
    authController.updateProfile
)

// PUT /api/auth/:id - Update user profile by ID with Multer
router.put('/:id', authorizedMiddleware, uploads.single('imageUrl'), authController.updateProfile);

// DELETE /api/auth/profile/picture - Delete user profile picture
router.delete('/profile/picture', authorizedMiddleware, authController.deleteProfilePicture);

export default router;
