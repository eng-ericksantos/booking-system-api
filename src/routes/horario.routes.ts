import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';

const horarioRouter = Router({ mergeParams: true });

horarioRouter.post('/', authMiddleware, validate(createHorarioSchema), HorarioDisponivelController.create);
horarioRouter.get('/', authMiddleware, HorarioDisponivelController.findByProfissionalId);
horarioRouter.delete('/:id', authMiddleware, validate(horarioIdSchema), HorarioDisponivelController.delete);

export default horarioRouter;