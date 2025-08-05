import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { createServicoSchema } from '../shared/validators/servicoValidator';
import { validate } from '../shared/middlewares/validate';

const servicoRouter = Router();

servicoRouter.post('/', validate(createServicoSchema), ServicoController.create);
servicoRouter.get('/', ServicoController.findAll);
servicoRouter.get('/:id', ServicoController.findById);
servicoRouter.put('/:id', ServicoController.update);
servicoRouter.delete('/:id', ServicoController.delete);

export default servicoRouter;