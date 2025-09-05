import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';
import { authorize } from '../shared/middlewares/authorizeMiddleware';
import { Role } from '@prisma/client';

const agendamentoRouter = Router();
const agendamentoController = container.resolve(AgendamentoController);

agendamentoRouter.post('/', authMiddleware, authorize([Role.CLIENTE, Role.ADMIN]), validate(createAgendamentoSchema), (req, res) => agendamentoController.create(req, res));
agendamentoRouter.get('/', authMiddleware, (req, res) => agendamentoController.findAll(req, res));
agendamentoRouter.patch('/:id/status', authMiddleware, validate(updateAgendamentoStatusSchema), (req, res) => agendamentoController.updateStatus(req, res));

export default agendamentoRouter;