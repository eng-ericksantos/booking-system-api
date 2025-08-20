import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { container } from 'tsyringe';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', (req, res) => authController.login(req, res));

export default authRouter;