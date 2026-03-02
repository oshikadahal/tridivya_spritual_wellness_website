import { Router } from 'express';
import { initiateEsewaV2Payment, esewaV2Success, esewaV2Failure } from '../controllers/payment.controller';

const router = Router();

router.post('/esewa/initiate', initiateEsewaV2Payment);
router.get('/esewa/success', esewaV2Success);
router.get('/esewa/failure', esewaV2Failure);

export default router;
