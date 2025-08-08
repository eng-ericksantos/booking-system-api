import { Router } from 'express';
import ProfissionalController from '../controllers/ProfissionalController';
import horarioRouter from './horario.routes';
import { validate } from '../shared/middlewares/validate';
import { createProfissionalSchema, updateProfissionalSchema } from '../shared/validators/prossifionalValidator';

const profissionalRouter = Router();

profissionalRouter.post('/', validate(createProfissionalSchema), ProfissionalController.create);

profissionalRouter.get('/', ProfissionalController.findAll);

profissionalRouter.get('/:id', ProfissionalController.findById);

profissionalRouter.put('/:id', validate(updateProfissionalSchema), ProfissionalController.update);

profissionalRouter.delete('/:id', ProfissionalController.delete);

profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;