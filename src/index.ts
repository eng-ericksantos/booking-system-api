import 'dotenv/config'; // Carrega as variáveis de ambiente do .env
import express, { Request, Response } from 'express';
import cors from 'cors';
import servicoRouter from './routes/servico.routes';
import profissionalRouter from './routes/profissional.routes';
import agendamentoRouter from './routes/agendamento.routes';
import { errorHandler } from './shared/middlewares/errorHandler';

// Inicializa a aplicação Express
const app = express();

// Middlewares
app.use(cors()); // Habilita o CORS para todas as origens
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Uma rota de "health check" para verificar se a API está no ar
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'API is running!' });
});

app.use('/api/servicos', servicoRouter);
app.use('/api/profissionais', profissionalRouter);
app.use('/api/agendamentos', agendamentoRouter);

app.use(errorHandler);

// Define a porta a partir das variáveis de ambiente ou usa 3001 como padrão
const PORT = process.env.PORT || 3001;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});