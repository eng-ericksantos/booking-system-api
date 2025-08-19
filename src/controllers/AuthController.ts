import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const resultado = await AuthService.login({ email, senha });
            res.status(200).json(resultado);
        } catch (error: any) {
            res.status(401).json({ error: error.message }); // 401 Unauthorized
        }
    }
}

export default new AuthController();