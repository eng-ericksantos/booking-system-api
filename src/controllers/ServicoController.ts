import { Request, Response } from 'express';
import ServicoService from '../services/ServicoService';

class ServicoController {
  // Lida com a requisição de criação de um novo serviço
  async create(req: Request, res: Response) {
    try {
      const servico = await ServicoService.create(req.body);
      res.status(201).json(servico); // 201 Created
    } catch (error: any) {
      res.status(400).json({ error: error.message }); // 400 Bad Request
    }
  }

  // Lida com a requisição de listagem de todos os serviços
  async findAll(req: Request, res: Response) {
    try {
      const servicos = await ServicoService.findAll();
      res.status(200).json(servicos); // 200 OK
    } catch (error: any) {
      res.status(500).json({ error: 'Erro interno do servidor' }); // 500 Internal Server Error
    }
  }

  // Lida com a requisição de busca de um serviço por ID
  async findById(req: Request, res: Response) {
    try {
      const servico = await ServicoService.findById(req.params.id);
      res.status(200).json(servico);
    } catch (error: any) {
      // Se o serviço não for encontrado, o service lança um erro.
      // Aqui, retornamos um status 404 Not Found.
      res.status(404).json({ error: error.message });
    }
  }

  // Lida com a requisição de atualização de um serviço
  async update(req: Request, res: Response) {
    try {
      const servico = await ServicoService.update(req.params.id, req.body);
      res.status(200).json(servico);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Lida com a requisição de deleção de um serviço
  async delete(req: Request, res: Response) {
    try {
      await ServicoService.delete(req.params.id);
      res.status(204).send(); // 204 No Content
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default new ServicoController();