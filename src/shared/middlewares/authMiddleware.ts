import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    // 1. Verifica se o header de autorização foi enviado
    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // 2. Separa o "Bearer" do token
    const parts = authorization.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token com formato inválido.' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    const secret: Secret = process.env.JWT_SECRET || '';
    if (!secret) {
        throw new Error('O segredo JWT não está configurado no arquivo .env');
    }

    // 3. Valida o token
    try {
        const payload = jwt.verify(token, secret) as TokenPayload;

        // 4. Anexa o payload (id e role) ao objeto 'req'
        req.usuario = { id: payload.id, role: payload.role as any };

        // 5. Permite que a requisição continue
        return next();
    } catch {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}