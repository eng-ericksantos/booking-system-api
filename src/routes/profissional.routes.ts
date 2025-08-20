import { Router } from 'express';
import ProfissionalController from '../controllers/ProfissionalController';
import horarioRouter from './horario.routes';
import { validate } from '../shared/middlewares/validate';
import { createProfissionalSchema, updateProfissionalSchema } from '../shared/validators/prossifionalValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { authorize } from '../shared/middlewares/authorizeMiddleware';
import { Role } from '@prisma/client';
import { container } from 'tsyringe';

const profissionalRouter = Router();
const profissionalController = container.resolve(ProfissionalController);

profissionalRouter.post('/', authMiddleware, authorize([Role.ADMIN]), validate(createProfissionalSchema), profissionalController.create);
profissionalRouter.get('/', authMiddleware, profissionalController.findAll);
profissionalRouter.get('/:id', authMiddleware, profissionalController.findById);
profissionalRouter.put('/:id', authMiddleware, validate(updateProfissionalSchema), profissionalController.update);
profissionalRouter.delete('/:id', authMiddleware, profissionalController.delete);

profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;