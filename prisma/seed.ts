import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import logger from '../src/shared/logs/logger';

const prisma = new PrismaClient();

async function main() {
    logger.info('Iniciando o processo de seeding...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw new Error('As variáveis de ambiente ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidas.');
    }

    // 1. Verifica se o usuário admin já existe
    const adminExists = await prisma.usuario.findUnique({
        where: { email: adminEmail },
    });

    if (adminExists) {
        logger.info('Usuário admin já existe. Nada a fazer.');
    } else {
        // 2. Se não existir, cria o usuário admin
        const hashedPassword = await bcrypt.hash(adminPassword, 8);

        await prisma.usuario.create({
            data: {
                email: adminEmail,
                senha: hashedPassword,
                role: Role.ADMIN,
            },
        });
        logger.info('Usuário admin criado com sucesso!');
    }

    logger.info('Seeding finalizado.');
}

main()
    .catch((e) => {
        logger.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });