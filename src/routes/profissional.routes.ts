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
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome: { type: string }
 * email: { type: string, format: email }
 * example:
 * nome: "Dr. House"
 * email: "house@example.com"
 * responses:
 * '201':
 * description: O profissional foi criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '400':
 * description: Dados de entrada inválidos ou e-mail já existente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
profissionalRouter.post('/', validate(createProfissionalSchema), ProfissionalController.create);

/**
 * @swagger
 * /api/profissionais:
 * get:
 * summary: Retorna a lista de todos os profissionais
 * tags: [Profissionais]
 * responses:
 * '200':
 * description: A lista de profissionais.
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
 * summary: Busca um profissional pelo ID
 * tags: [Profissionais]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * description: O ID do profissional.
 * responses:
 * '200':
 * description: Dados do profissional.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '404':
 * description: Profissional não encontrado.
 */
profissionalRouter.get('/:id', ProfissionalController.findById);

/**
 * @swagger
 * /api/profissionais/{id}:
 * put:
 * summary: Atualiza um profissional existente
 * tags: [Profissionais]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome: { type: string }
 * email: { type: string, format: email }
 * example:
 * nome: "Dr. Gregory House"
 * responses:
 * '200':
 * description: Profissional atualizado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Profissional'
 * '404':
 * description: Profissional não encontrado.
 */
profissionalRouter.put('/:id', validate(updateProfissionalSchema), ProfissionalController.update);

/**
 * @swagger
 * /api/profissionais/{id}:
 * delete:
 * summary: Deleta um profissional
 * tags: [Profissionais]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * format: uuid
 * responses:
 * '204':
 * description: Profissional deletado com sucesso.
 * '404':
 * description: Profissional não encontrado.
 */
profissionalRouter.delete('/:id', ProfissionalController.delete);


profissionalRouter.use('/:profissionalId/horarios', horarioRouter);

export default profissionalRouter;