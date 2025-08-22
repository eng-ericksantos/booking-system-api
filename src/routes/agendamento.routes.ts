import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const agendamentoRouter = Router();
const agendamentoController = container.resolve(AgendamentoController);

agendamentoRouter.post('/', authMiddleware, validate(createAgendamentoSchema), (req, res) => agendamentoController.create(req, res));
agendamentoRouter.get('/', authMiddleware, (req, res) => agendamentoController.findAll(req, res));
agendamentoRouter.patch('/:id/status', authMiddleware, validate(updateAgendamentoStatusSchema), (req, res) => agendamentoController.updateStatus(req, res));

export default agendamentoRouter;