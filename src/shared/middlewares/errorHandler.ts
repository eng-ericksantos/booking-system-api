import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error); // Log do erro para debug

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Erro conhecido do Prisma (ex: registro não encontrado, violação de constraint)
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Recurso não encontrado.' });
        }
        return res.status(409).json({ message: `Erro de banco de dados: ${error.message}` });
    }

    // Nossos erros de negócio personalizados
    if (error.message.includes('não encontrado') || error.message.includes('inválido')) {
        return res.status(404).json({ message: error.message });
    }

    if (error.message.includes('sobreposto') || error.message.includes('indisponível')) {
        return res.status(409).json({ message: error.message });
    }

    // Erro genérico
    return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
};