import { Router } from 'express';
import ProfissionalController from '../controllers/ProfissionalController';
import horarioRouter from './horario.routes';
import { validate } from '../shared/middlewares/validate';
import { createProfissionalSchema, updateProfissionalSchema } from '../shared/validators/prossifionalValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';

const profissionalRouter = Router();

profissionalRouter.post('/', validate(createProfissionalSchema), ProfissionalController.create);
profissionalRouter.get('/', authMiddleware, ProfissionalController.findAll);
profissionalRouter.get('/:id', authMiddleware, ProfissionalController.findById);
profissionalRouter.put('/:id', authMiddleware, validate(updateProfissionalSchema), ProfissionalController.update);
profissionalRouter.delete('/:id', authMiddleware, ProfissionalController.delete);

profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;