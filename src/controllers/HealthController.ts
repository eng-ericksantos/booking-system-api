import { Request, Response } from 'express';
import { prisma } from '../shared/prisma'; // Importe direto do prisma

export default class HealthController {
    public async check(req: Request, res: Response): Promise<Response> {
        try {
            await prisma.$queryRaw`SELECT 1`;

            return res.status(200).json({
                message: 'Aplicação está saudável.',
                status: 'ok',
                timestamp: new Date().toISOString(),
                db_status: 'ok',
            });
        } catch (error) {
            console.error('Falha no Health Check:', error);
            return res.status(503).json({ // 503 Service Unavailable
                message: 'Aplicação com problemas de saúde.',
                status: 'error',
                timestamp: new Date().toISOString(),
                db_status: 'indisponível',
            });
        }
    }
}