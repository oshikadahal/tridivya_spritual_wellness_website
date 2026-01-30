import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {authorizedMiddleware} from '../middlewares/authorization.middleware';
import { uploads } from "../middlewares/upload.middleware";

const authController = new AuthController();
const router = Router();

router.post('/register', authController.register);

router.put("/whoiam", authorizedMiddleware, uploads.single("image"), authController.updateProfile);
router.put(
    "/update-profile",
    authorizedMiddleware,
    uploads.single("image"),
    authController.updateProfile
)
router.post('/login', authController.login);
router.get('/whoami', authorizedMiddleware, authController.getProfile);
export default router;
