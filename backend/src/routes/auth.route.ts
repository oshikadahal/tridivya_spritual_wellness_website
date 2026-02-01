import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {authorizedMiddleware} from '../middlewares/authorization.middleware';
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Get current user profile
router.get('/profile', authorizedMiddleware, authController.getProfile);
router.get('/whoami', authorizedMiddleware, authController.getProfile);

// Upload profile picture
router.put('/profile', authorizedMiddleware, uploads.single('profilePicture'), authController.uploadProfilePicture);
router.put("/whoiam", authorizedMiddleware, uploads.single("profilePicture"), authController.uploadProfilePicture);
router.put(
    "/update-profile",
    authorizedMiddleware,
    uploads.single("profilePicture"),
    authController.uploadProfilePicture
)

// PUT /api/auth/:id - Update user profile by ID with Multer
router.put('/:id', authorizedMiddleware, uploads.single('imageUrl'), authController.updateProfile);

export default router;
