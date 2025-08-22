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

profissionalRouter.post('/', authMiddleware, authorize([Role.ADMIN]), validate(createProfissionalSchema), (req, res) => profissionalController.create(req, res));
profissionalRouter.get('/', authMiddleware, (req, res) => profissionalController.findAll(req, res));
profissionalRouter.get('/:id', authMiddleware, (req, res) => profissionalController.findById(req, res));
profissionalRouter.put('/:id', authMiddleware, validate(updateProfissionalSchema), (req, res) => profissionalController.update(req, res));
profissionalRouter.delete('/:id', authMiddleware, (req, res) => profissionalController.delete(req, res));

profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;