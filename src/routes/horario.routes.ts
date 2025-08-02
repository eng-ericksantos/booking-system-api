import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';

// A opção { mergeParams: true } permite que este router acesse parâmetros da rota pai (ex: :profissionalId)
const horarioRouter = Router({ mergeParams: true });

horarioRouter.post('/', HorarioDisponivelController.create);
horarioRouter.get('/', HorarioDisponivelController.findByProfissionalId);
// Para deletar um horário específico, precisamos de seu próprio ID
horarioRouter.delete('/:id', HorarioDisponivelController.delete);

export default horarioRouter;