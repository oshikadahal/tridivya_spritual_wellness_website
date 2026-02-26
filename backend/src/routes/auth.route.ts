import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {authorizedMiddleware} from '../middlewares/authorization.middleware';
import { profileImageUploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.post('/change-password', authorizedMiddleware, authController.changePassword.bind(authController));

// Get current user profile
router.get('/profile', authorizedMiddleware, authController.getProfile.bind(authController));
router.get('/whoami', authorizedMiddleware, authController.getProfile.bind(authController));

// Upload profile picture - accepts imageUrl field from frontend
router.put('/profile', authorizedMiddleware, profileImageUploads.single('imageUrl'), authController.updateProfile.bind(authController));
router.put("/whoiam", authorizedMiddleware, profileImageUploads.single("imageUrl"), authController.updateProfile.bind(authController));
router.put(
    "/update-profile",
    authorizedMiddleware,
    profileImageUploads.single("imageUrl"),
    authController.updateProfile.bind(authController)
)

// PUT /api/auth/:id - Update user profile by ID with Multer
router.put('/:id', authorizedMiddleware, profileImageUploads.single('imageUrl'), authController.updateProfile.bind(authController));

// DELETE /api/auth/profile/picture - Delete user profile picture
router.delete('/profile/picture', authorizedMiddleware, authController.deleteProfilePicture.bind(authController));

export default router;
