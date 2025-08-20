import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe'; // Importar decorators
import AuthService from '../services/AuthService';

@injectable()
export default class AuthController {

    constructor(
        @inject('AuthService') private authService: AuthService
    ) { }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const resultado = await this.authService.login(req.body);
            return res.status(200).json(resultado);
        } catch (error: any) {
            return res.status(401).json({ error: error.message });
        }
    }
}