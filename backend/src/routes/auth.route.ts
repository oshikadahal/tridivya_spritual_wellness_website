import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authController = new AuthController();
const router = Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
// temporary: echo endpoint to inspect raw request body
router.post('/_echo', (req, res) => { return res.status(200).json({ body: req.body, headers: req.headers }); });

export default router;
