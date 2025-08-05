import { Router } from 'express';
import ProfissionalController from '../controllers/ProfissionalController';
import horarioRouter from './horario.routes'; // <-- IMPORTAR
import { createProfissionalSchema, updateProfissionalSchema } from '../shared/validators/prossifionalValidator';
import { validate } from '../shared/middlewares/validate';

const profissionalRouter = Router();

// Rotas de Profissional
profissionalRouter.post('/', validate(createProfissionalSchema), ProfissionalController.create);
profissionalRouter.get('/', ProfissionalController.findAll);
profissionalRouter.get('/:id', ProfissionalController.findById);
profissionalRouter.put('/:id', validate(updateProfissionalSchema), ProfissionalController.update);
profissionalRouter.delete('/:id', ProfissionalController.delete);

// Aninhando o router de horários
// Todas as rotas em horarioRouter terão o prefixo /:profissionalId/horarios
profissionalRouter.use('/:profissionalId/horarios', horarioRouter); // <-- ADICIONAR

export default profissionalRouter;