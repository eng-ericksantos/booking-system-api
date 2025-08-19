import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';

const agendamentoRouter = Router();

agendamentoRouter.post('/', authMiddleware, validate(createAgendamentoSchema), AgendamentoController.create);
agendamentoRouter.get('/', authMiddleware, AgendamentoController.findAll);
agendamentoRouter.patch('/:id/status', authMiddleware, validate(updateAgendamentoStatusSchema), AgendamentoController.updateStatus);

export default agendamentoRouter;