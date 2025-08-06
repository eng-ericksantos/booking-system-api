import 'dotenv/config'; // Carrega as variáveis de ambiente do .env
import express, { Request, Response } from 'express';
import cors from 'cors';
import servicoRouter from './routes/servico.routes';
import profissionalRouter from './routes/profissional.routes';
import agendamentoRouter from './routes/agendamento.routes';
import { errorHandler } from './shared/middlewares/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import logger from './shared/logs/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// Inicializa a aplicação Express
const app = express();


// Middlewares
app.use(pinoHttp({ logger }));
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

app.use('/api', limiter); // Aplica o rate limit a todas as rotas /api

// Uma rota de "health check" para verificar se a API está no ar
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'API is running!' });
});

// Rotas da API
app.use('/api/servicos', servicoRouter);
app.use('/api/profissionais', profissionalRouter);
app.use('/api/agendamentos', agendamentoRouter);

// Rota da Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

// Define a porta a partir das variáveis de ambiente ou usa 3001 como padrão
const PORT = process.env.PORT || 3001;

// Inicia o servidor
app.listen(PORT, () => {
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    logger.info(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});