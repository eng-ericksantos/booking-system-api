import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';

const servicoRouter = Router();

servicoRouter.post('/', ServicoController.create);
servicoRouter.get('/', ServicoController.findAll);
servicoRouter.get('/:id', ServicoController.findById);
servicoRouter.put('/:id', ServicoController.update);
servicoRouter.delete('/:id', ServicoController.delete);

export default servicoRouter;