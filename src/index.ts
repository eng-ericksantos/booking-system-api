import 'dotenv/config';
import 'reflect-metadata';
import './shared/container';

import logger from './shared/logs/logger';
import { prisma } from './shared/prisma';
import { app } from './app';

// Define a porta a partir das variáveis de ambiente ou usa 3001 como padrão
const PORT = process.env.PORT || 3001;

// Armazenar a instância do servidor
const server = app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
    logger.info(`📄 Documentação disponível em http://localhost:${PORT}/api-docs`);
});

// Bloco de Graceful Shutdown  ("ouvir" os sinais de desligamento do sistema)
const signals = ['SIGTERM', 'SIGINT'];

function gracefulShutdown(signal: string) {
    process.on(signal, async () => {
        logger.info(`Recebido sinal ${signal}, desligando o servidor...`);

        server.close(async () => {
            logger.info('Servidor HTTP fechado.');
            await prisma.$disconnect();
            logger.info('Conexão com o banco de dados fechada.');
            process.exit(0);
        });

        // Forçar o desligamento após 10 segundos se as conexões não fecharem
        setTimeout(() => {
            logger.error('Desligamento forçado após timeout de 10s.');
            process.exit(1);
        }, 10000);
    });
}

signals.forEach(signal => {
    gracefulShutdown(signal);
});