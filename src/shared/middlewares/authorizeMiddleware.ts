import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export function authorize(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { usuario } = req;

        // Se o authMiddleware não foi executado antes, req.usuario não existirá
        if (!usuario) {
            return res.status(401).json({ error: 'Token inválido ou mal formatado.' });
        }

        // Verifica se o cargo do usuário está na lista de cargos permitidos
        if (!roles.includes(usuario.role)) {
            // 403 Forbidden: O usuário está autenticado, mas não tem permissão.
            return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
        }

        return next();
    };
}