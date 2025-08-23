import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import AgendamentoService from '../services/AgendamentoService';

@injectable()
export default class AgendamentoController {

    constructor(
        @inject('AgendamentoService') private agendamentoService: AgendamentoService
    ) { }

    public async create(req: Request, res: Response): Promise<Response> {
        const resultado = await this.agendamentoService.create(req.body, req.usuario);
        return res.status(201).json(resultado);
    }

    public async findAll(req: Request, res: Response): Promise<Response> {
        const agendamentos = await this.agendamentoService.findAll();
        return res.status(200).json(agendamentos);
    }

    public async updateStatus(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { status } = req.body;

        const agendamento = await this.agendamentoService.updateStatus(id, status);
        return res.status(200).json(agendamento);
    }
}