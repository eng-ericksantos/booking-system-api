import { Router } from 'express';
import AgendamentoController from '../controllers/AgendamentoController';
import { validate } from '../shared/middlewares/validate';
import { createAgendamentoSchema, updateAgendamentoStatusSchema } from '../shared/validators/agendamentoValidator';

const agendamentoRouter = Router();

/**
 * @swagger
 * tags:
 * name: Agendamentos
 * description: API para criação e gerenciamento de agendamentos
 */

/**
 * @swagger
 * /api/agendamentos:
 * post:
 * summary: Cria um novo agendamento
 * tags: [Agendamentos]
 * requestBody:
 * $ref: '#/components/requestBodies/AgendamentoBody'
 * responses:
 * '201':
 * description: Agendamento criado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Agendamento'
 * '409':
 * $ref: '#/components/responses/Conflict'
 */
agendamentoRouter.post('/', validate(createAgendamentoSchema), AgendamentoController.create);

/**
 * @swagger
 * /api/agendamentos:
 * get:
 * summary: Lista todos os agendamentos
 * tags: [Agendamentos]
 * responses:
 * '200':
 * description: Lista de agendamentos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Agendamento'
 */
agendamentoRouter.get('/', AgendamentoController.findAll);

/**
 * @swagger
 * /api/agendamentos/{id}/status:
 * patch:
 * summary: Atualiza o status de um agendamento
 * tags: [Agendamentos]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * requestBody:
 * $ref: '#/components/requestBodies/UpdateStatusBody'
 * responses:
 * '200':
 * description: Status atualizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Agendamento'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
agendamentoRouter.patch('/:id/status', validate(updateAgendamentoStatusSchema), AgendamentoController.updateStatus);

export default agendamentoRouter;