import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';

const agendamentoRouter = Router();

agendamentoRouter.post('/', validate(createAgendamentoSchema), AgendamentoController.create);

agendamentoRouter.get('/', AgendamentoController.findAll);

agendamentoRouter.patch('/:id/status', validate(updateAgendamentoStatusSchema), AgendamentoController.updateStatus);

export default agendamentoRouter;