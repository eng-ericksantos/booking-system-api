import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';

// A opção { mergeParams: true } permite que este router acesse parâmetros da rota pai (ex: :profissionalId)
const horarioRouter = Router({ mergeParams: true });

horarioRouter.post('/', validate(createHorarioSchema), HorarioDisponivelController.create);
horarioRouter.get('/', HorarioDisponivelController.findByProfissionalId);
horarioRouter.delete('/:id', validate(horarioIdSchema), HorarioDisponivelController.delete);

export default horarioRouter;