import { Request, Response } from 'express';
import AgendamentoService from '../services/AgendamentoService';

class AgendamentoController {
    async create(req: Request, res: Response) {
        // O corpo da requisição deve conter:
        // servicoId, profissionalId, data, nomeCliente, telefoneCliente
        const agendamento = await AgendamentoService.create(req.body);
        res.status(201).json(agendamento);
    }

    async findAll(req: Request, res: Response) {
        const agendamentos = await AgendamentoService.findAll();
        res.status(200).json(agendamentos);
    }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body; // ex: "Realizado"

        // O serviço irá validar se o status é um valor válido do Enum
        const agendamento = await AgendamentoService.updateStatus(id, status);
        res.status(200).json(agendamento);
    }

}

export default new AgendamentoController();