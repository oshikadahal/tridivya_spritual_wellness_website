import { Router } from 'express';
import { HomeController } from '../controllers/home.controller';

const router = Router();
const homeController = new HomeController();

router.get('/', homeController.home);
router.post('/mood-checkins', homeController.moodCheckin);

export default router;
