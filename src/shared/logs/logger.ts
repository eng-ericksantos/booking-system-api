import pino from 'pino';

const logger = pino({
    // Se não estiver em produção, usa o pino-pretty para formatar
    transport: process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
                ignore: 'pid,hostname',
            },
        }
        : undefined,
});

export default logger;