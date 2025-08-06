import { Router } from 'express';
import ServicoController from '../controllers/ServicoController';
import { validate } from '../shared/middlewares/validate';
import { createServicoSchema } from '../shared/validators/servicoValidator';

const servicoRouter = Router();

/**
 * @swagger
 * tags:
 * name: Serviços
 * description: API para gerenciamento de serviços oferecidos
 */

/**
 * @swagger
 * /api/servicos:
 * post:
 * summary: Cria um novo serviço
 * tags: [Serviços]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * example:
 * nome: "Massagem Relaxante"
 * descricao: "Massagem de 60 minutos para alívio de estresse."
 * preco: 150
 * duracao: 60
 * responses:
 * '201':
 * description: Serviço criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '400':
 * description: Dados de entrada inválidos.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
servicoRouter.post('/', validate(createServicoSchema), ServicoController.create);

/**
 * @swagger
 * /api/servicos:
 * get:
 * summary: Retorna a lista de todos os serviços
 * tags: [Serviços]
 * responses:
 * '200':
 * description: A lista de serviços.
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
 * summary: Busca um serviço pelo ID
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/ServicoId'
 * responses:
 * '200':
 * description: Dados do serviço.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '404':
 * description: Serviço não encontrado.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
servicoRouter.get('/:id', ServicoController.findById);

/**
 * @swagger
 * /api/servicos/{id}:
 * put:
 * summary: Atualiza um serviço existente
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/ServicoId'
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * example:
 * preco: 160
 * responses:
 * '200':
 * description: Serviço atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Servico'
 * '404':
 * description: Serviço não encontrado.
 */
servicoRouter.put('/:id', ServicoController.update);

/**
 * @swagger
 * /api/servicos/{id}:
 * delete:
 * summary: Deleta um serviço
 * tags: [Serviços]
 * parameters:
 * - $ref: '#/components/parameters/ServicoId'
 * responses:
 * '204':
 * description: Serviço deletado com sucesso.
 * '404':
 * description: Serviço não encontrado.
 */
servicoRouter.delete('/:id', ServicoController.delete);

export default servicoRouter;