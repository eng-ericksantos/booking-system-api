import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const servicoRouter = Router();
const servicoController = container.resolve(ServicoController);

servicoRouter.post('/', authMiddleware, validate(createServicoSchema), (req, res) => servicoController.create(req, res));
servicoRouter.get('/', authMiddleware, (req, res) => servicoController.findAll(req, res));
servicoRouter.get('/:id', authMiddleware, (req, res) => servicoController.findById(req, res));
servicoRouter.put('/:id', authMiddleware, (req, res) => servicoController.update(req, res));
servicoRouter.delete('/:id', authMiddleware, (req, res) => servicoController.delete(req, res));

export default servicoRouter;