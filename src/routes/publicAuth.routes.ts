import { Router } from 'express';
import PublicAuthController from '../controllers/PublicAuthController';

const publicAuthRouter = Router();
const publicAuthController = new PublicAuthController();

publicAuthRouter.post('/auth/generate-otp', (req, res) => publicAuthController.generateOtp(req, res));
publicAuthRouter.post('/auth/verify-otp', (req, res) => publicAuthController.verifyOtp(req, res));

export default publicAuthRouter;