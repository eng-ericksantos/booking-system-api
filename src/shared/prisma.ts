import { PrismaClient } from '@prisma/client';

// Cria uma única instância do PrismaClient para ser usada em toda a aplicação.
// Isso evita a criação de múltiplas conexões com o banco de dados.
export const prisma = new PrismaClient();