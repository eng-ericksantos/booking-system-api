import 'reflect-metadata';
import './shared/container';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import logger from './shared/logs/logger';
import { errorHandler } from './shared/middlewares/errorHandler';

// Imports das rotas
import authRouter from './routes/auth.routes';
import servicoRouter from './routes/servico.routes';
import profissionalRouter from './routes/profissional.routes';
import agendamentoRouter from './routes/agendamento.routes';

// Imports do swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import healthRouter from './routes/health.routes';

const app = express();

// Middlewares
// app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL, // Permite apenas a origem definida na variável de ambiente
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
})); // Habilita o CORS para todas as origens
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Configuração do Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos
    max: 100, // Permite 100 requisições por IP nesta janela
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Muitas requisições enviadas deste IP, por favor tente novamente após 15 minutos.'
});

app.use('/api', healthRouter); // Uma rota de "health check" para verificar se a API está no ar
app.use('/api', limiter); // Aplica o rate limit a todas as rotas /api

// Rotas da API
app.use('/api/servicos', servicoRouter);
app.use('/api/profissionais', profissionalRouter);
app.use('/api/agendamentos', agendamentoRouter);
app.use('/api', authRouter);

// Rota da Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

// Exporta o app para ser usado nos testes e no index.ts
export { app };