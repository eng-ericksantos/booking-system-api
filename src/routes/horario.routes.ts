import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const horarioRouter = Router({ mergeParams: true });
const horarioDisponivelController = container.resolve(HorarioDisponivelController);

horarioRouter.post('/', authMiddleware, validate(createHorarioSchema), (req, res) => horarioDisponivelController.create(req, res));
horarioRouter.get('/', authMiddleware, (req, res) => horarioDisponivelController.findByProfissionalId(req, res));
horarioRouter.delete('/:id', authMiddleware, validate(horarioIdSchema), (req, res) => horarioDisponivelController.delete(req, res));

export default horarioRouter;