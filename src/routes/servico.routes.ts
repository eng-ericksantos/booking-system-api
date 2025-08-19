import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';
import { authMiddleware } from '../shared/middlewares/authMiddleware';

const servicoRouter = Router();

servicoRouter.post('/', authMiddleware, validate(createServicoSchema), ServicoController.create);
servicoRouter.get('/', authMiddleware, ServicoController.findAll);
servicoRouter.get('/:id', authMiddleware, ServicoController.findById);
servicoRouter.put('/:id', authMiddleware, ServicoController.update);
servicoRouter.delete('/:id', authMiddleware, ServicoController.delete);

export default servicoRouter;