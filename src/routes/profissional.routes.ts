import { Router } from 'express';
import ProfissionalController from '../controllers/ProfissionalController';
import horarioRouter from './horario.routes';
import { validate } from '../shared/middlewares/validate';
import { createProfissionalSchema, updateProfissionalSchema } from '../shared/validators/prossifionalValidator';

const profissionalRouter = Router();

/**
 * @swagger
 * tags:
 * name: Profissionais
 * description: API para gerenciamento de profissionais
 */

/**
 * @swagger
 * /api/profissionais:
 * post:
 * summary: Cria um novo profissional
 * tags: [Profissionais]
 * requestBody:
 * $ref: '#/components/requestBodies/ProfissionalBody'
 * responses:
 * '201':
 * description: Profissional criado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '400':
 * $ref: '#/components/responses/BadRequest'
 */
profissionalRouter.post('/', validate(createProfissionalSchema), ProfissionalController.create);

/**
 * @swagger
 * /api/profissionais:
 * get:
 * summary: Lista todos os profissionais
 * tags: [Profissionais]
 * responses:
 * '200':
 * description: Lista de profissionais.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Profissional'
 */
profissionalRouter.get('/', ProfissionalController.findAll);

/**
 * @swagger
 * /api/profissionais/{id}:
 * get:
 * summary: Busca um profissional por ID
 * tags: [Profissionais]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * responses:
 * '200':
 * description: Dados do profissional.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
profissionalRouter.get('/:id', ProfissionalController.findById);

/**
 * @swagger
 * /api/profissionais/{id}:
 * put:
 * summary: Atualiza um profissional
 * tags: [Profissionais]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * requestBody:
 * $ref: '#/components/requestBodies/ProfissionalBody'
 * responses:
 * '200':
 * description: Profissional atualizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
profissionalRouter.put('/:id', validate(updateProfissionalSchema), ProfissionalController.update);

/**
 * @swagger
 * /api/profissionais/{id}:
 * delete:
 * summary: Deleta um profissional
 * tags: [Profissionais]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * responses:
 * '204':
 * $ref: '#/components/responses/NoContent'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
profissionalRouter.delete('/:id', ProfissionalController.delete);

profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;