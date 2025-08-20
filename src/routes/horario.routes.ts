import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const horarioRouter = Router({ mergeParams: true });
const horarioDisponivelController = container.resolve(HorarioDisponivelController);

horarioRouter.post('/', authMiddleware, validate(createHorarioSchema), horarioDisponivelController.create);
horarioRouter.get('/', authMiddleware, horarioDisponivelController.findByProfissionalId);
horarioRouter.delete('/:id', authMiddleware, validate(horarioIdSchema), horarioDisponivelController.delete);

export default horarioRouter;