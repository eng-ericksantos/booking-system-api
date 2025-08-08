import { Router } from 'express';
import HorarioDisponivelController from '../controllers/HorarioDisponivelController';
import { validate } from '../shared/middlewares/validate';
import { createHorarioSchema, horarioIdSchema } from '../shared/validators/horarioValidator';

const horarioRouter = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 * name: Horários
 * description: Gerenciamento dos horários de trabalho dos profissionais
 */

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios:
 * post:
 * summary: Cria um novo horário para um profissional
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalIdFromPath'
 * requestBody:
 * $ref: '#/components/requestBodies/HorarioBody'
 * responses:
 * '201':
 * description: Horário criado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/HorarioDisponivel'
 * '409':
 * $ref: '#/components/responses/Conflict'
 */
horarioRouter.post('/', validate(createHorarioSchema), HorarioDisponivelController.create);

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios:
 * get:
 * summary: Lista os horários de um profissional
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalIdFromPath'
 * responses:
 * '200':
 * description: Lista de horários.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/HorarioDisponivel'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
horarioRouter.get('/', HorarioDisponivelController.findByProfissionalId);

/**
 * @swagger
 * /api/profissionais/{profissionalId}/horarios/{id}:
 * delete:
 * summary: Deleta um horário de um profissional
 * tags: [Horários]
 * parameters:
 * - $ref: '#/components/parameters/ProfissionalIdFromPath'
 * - $ref: '#/components/parameters/IdFromPath'
 * responses:
 * '204':
 * $ref: '#/components/responses/NoContent'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
horarioRouter.delete('/:id', validate(horarioIdSchema), HorarioDisponivelController.delete);

export default horarioRouter;