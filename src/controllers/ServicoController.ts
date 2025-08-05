import { Request, Response } from 'express';
import ServicoService from '../services/ServicoService';

class ServicoController {
  // Lida com a requisição de criação de um novo serviço
  async create(req: Request, res: Response) {
    const servico = await ServicoService.create(req.body);
    res.status(201).json(servico); // 201 Created
  }

  // Lida com a requisição de listagem de todos os serviços
  async findAll(req: Request, res: Response) {
    const servicos = await ServicoService.findAll();
    res.status(200).json(servicos); // 200 OK
  }

  // Lida com a requisição de busca de um serviço por ID
  async findById(req: Request, res: Response) {
    const servico = await ServicoService.findById(req.params.id);
    res.status(200).json(servico);
  }

  // Lida com a requisição de atualização de um serviço
  async update(req: Request, res: Response) {
    const servico = await ServicoService.update(req.params.id, req.body);
    res.status(200).json(servico);
  }

  // Lida com a requisição de deleção de um serviço
  async delete(req: Request, res: Response) {
    await ServicoService.delete(req.params.id);
    res.status(204).send(); // 204 No Content
  }
}

export default new ServicoController();