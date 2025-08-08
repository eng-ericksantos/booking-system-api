import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';

const servicoRouter = Router();

servicoRouter.post('/', validate(createServicoSchema), ServicoController.create);

servicoRouter.get('/', ServicoController.findAll);

servicoRouter.get('/:id', ServicoController.findById);

servicoRouter.put('/:id', ServicoController.update);

servicoRouter.delete('/:id', ServicoController.delete);

export default servicoRouter;