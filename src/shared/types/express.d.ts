import { Role } from '@prisma/client';

// Adicionamos o bloco 'declare global' para garantir que a modificação seja global
declare global {
    // Sobrescrevemos a declaração de tipos do namespace 'Express'
    namespace Express {
        // Para mesclar nossa nova propriedade com a interface Request original
        export interface Request {
            usuario: {
                id: string;
                role: Role;
            }
        }
    }
}