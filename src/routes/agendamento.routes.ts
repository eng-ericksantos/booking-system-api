import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';
import { validate } from '../shared/middlewares/validate';

const agendamentoRouter = Router();

agendamentoRouter.post('/', validate(createAgendamentoSchema), AgendamentoController.create);
agendamentoRouter.get('/', AgendamentoController.findAll);
agendamentoRouter.patch('/:id/status', validate(updateAgendamentoStatusSchema), AgendamentoController.updateStatus);

export default agendamentoRouter;