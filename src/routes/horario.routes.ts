import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';

const horarioRouter = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Horários
 * description: Gerenciamento de horários de trabalho dos profissionais
 */

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios:
 * post:
 * summary: Cria um novo horário de trabalho para um profissional
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalId'
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * diaDaSemana: { type: integer, example: 1 }
 * horaInicio: { type: string, example: '09:00' }
 * horaFim: { type: string, example: '18:00' }
 * responses:
 * 201:
 * description: Horário criado com sucesso.
 * content: { "application/json": { schema: { $ref: '#/components/schemas/HorarioDisponivel' } } }
 * 409:
 * description: Conflito de horário.
 */
horarioRouter.post('/', validate(createHorarioSchema), HorarioDisponivelController.create);

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios:
 * get:
 * summary: Lista todos os horários de trabalho de um profissional
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalId'
 * responses:
 * 200:
 * description: Lista de horários.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/HorarioDisponivel'
 * 404:
 * description: Profissional não encontrado.
 */
horarioRouter.get('/', HorarioDisponivelController.findByProfissionalId);

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios/{id}:
 * delete:
 * summary: Deleta um horário de trabalho específico
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalId'
 * - $ref: '#/components/parameters/HorarioId'
 * responses:
 * 204:
 * description: Horário deletado com sucesso.
 * 404:
 * description: Horário não encontrado.
 */
horarioRouter.delete('/:id', validate(horarioIdSchema), HorarioDisponivelController.delete);

export default horarioRouter;