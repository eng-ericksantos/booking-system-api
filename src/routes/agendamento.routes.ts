import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const agendamentoRouter = Router();
const agendamentoController = container.resolve(AgendamentoController);

agendamentoRouter.post('/', authMiddleware, validate(createAgendamentoSchema), agendamentoController.create);
agendamentoRouter.get('/', authMiddleware, agendamentoController.findAll);
agendamentoRouter.patch('/:id/status', authMiddleware, validate(updateAgendamentoStatusSchema), agendamentoController.updateStatus);

export default agendamentoRouter;