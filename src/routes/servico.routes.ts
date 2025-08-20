import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';
import { container } from 'tsyringe';

const servicoRouter = Router();
const servicoController = container.resolve(ServicoController);

servicoRouter.post('/', authMiddleware, validate(createServicoSchema), servicoController.create);
servicoRouter.get('/', authMiddleware, servicoController.findAll);
servicoRouter.get('/:id', authMiddleware, servicoController.findById);
servicoRouter.put('/:id', authMiddleware, servicoController.update);
servicoRouter.delete('/:id', authMiddleware, servicoController.delete);

export default servicoRouter;