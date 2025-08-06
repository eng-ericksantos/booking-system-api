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
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * servicoId: { type: string, format: uuid }
 * profissionalId: { type: string, format: uuid }
 * nomeCliente: { type: string }
 * telefoneCliente: { type: string }
 * data: { type: string, format: 'date-time' }
 * example:
 * servicoId: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"
 * profissionalId: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 * nomeCliente: "Juliana Paes"
 * telefoneCliente: "21912345678"
 * data: "2025-10-27T14:00:00.000Z"
 * responses:
 * 201:
 * description: Agendamento criado com sucesso.
 * content: { "application/json": { schema: { $ref: '#/components/schemas/Agendamento' } } }
 * 409:
 * description: Conflito - Horário indisponível ou regra de negócio violada.
 * content: { "application/json": { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
 */
agendamentoRouter.post('/', validate(createAgendamentoSchema), AgendamentoController.create);

/**
 * @swagger
 * /api/agendamentos:
 * get:
 * summary: Retorna a lista de todos os agendamentos
 * tags: [Agendamentos]
 * responses:
 * 200:
 * description: A lista de agendamentos.
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
 * - $ref: '#/components/parameters/AgendamentoId'
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [Confirmado, Cancelado, Realizado]
 * example:
 * status: "Realizado"
 * responses:
 * 200:
 * description: Status atualizado com sucesso.
 * content: { "application/json": { schema: { $ref: '#/components/schemas/Agendamento' } } }
 * 404:
 * description: Agendamento não encontrado.
 */
agendamentoRouter.patch('/:id/status', validate(updateAgendamentoStatusSchema), AgendamentoController.updateStatus);

export default agendamentoRouter;