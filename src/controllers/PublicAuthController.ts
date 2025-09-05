import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ClienteAuthService from '../services/ClienteAuthService';

export default class PublicAuthController {

    public async generateOtp(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        const clienteAuthService = container.resolve(ClienteAuthService);
        await clienteAuthService.generateOtp(email);
        return res.status(204).send(); // 204 No Content: Sucesso, mas sem corpo de resposta
    }

    public async verifyOtp(req: Request, res: Response): Promise<Response> {
        const clienteAuthService = container.resolve(ClienteAuthService);
        const result = await clienteAuthService.verifyOtp(req.body);
        return res.status(200).json(result);
    }
}