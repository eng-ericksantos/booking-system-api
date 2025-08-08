import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';

const servicoRouter = Router();

/**
 * @swagger
 * tags:
 * name: Serviços
 * description: API para gerenciamento de serviços
 */

/**
 * @swagger
 * /api/servicos:
 * post:
 * summary: Cria um novo serviço
 * tags: [Serviços]
 * requestBody:
 * $ref: '#/components/requestBodies/ServicoBody'
 * responses:
 * '201':
 * description: Serviço criado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '400':
 * $ref: '#/components/responses/BadRequest'
 */
servicoRouter.post('/', validate(createServicoSchema), ServicoController.create);

/**
 * @swagger
 * /api/servicos:
 * get:
 * summary: Lista todos os serviços
 * tags: [Serviços]
 * responses:
 * '200':
 * description: Lista de serviços.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Servico'
 */
servicoRouter.get('/', ServicoController.findAll);

/**
 * @swagger
 * /api/servicos/{id}:
 * get:
 * summary: Busca um serviço por ID
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * responses:
 * '200':
 * description: Dados do serviço.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
servicoRouter.get('/:id', ServicoController.findById);

/**
 * @swagger
 * /api/servicos/{id}:
 * put:
 * summary: Atualiza um serviço
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * requestBody:
 * $ref: '#/components/requestBodies/ServicoBody'
 * responses:
 * '200':
 * description: Serviço atualizado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
servicoRouter.put('/:id', ServicoController.update);

/**
 * @swagger
 * /api/servicos/{id}:
 * delete:
 * summary: Deleta um serviço
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/IdFromPath'
 * responses:
 * '204':
 * $ref: '#/components/responses/NoContent'
 * '404':
 * $ref: '#/components/responses/NotFound'
 */
servicoRouter.delete('/:id', ServicoController.delete);

export default servicoRouter;