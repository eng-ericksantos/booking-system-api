import { Request, Response } from 'express';
import HorarioDisponivelService from '../services/HorarioDisponivelService';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class HorarioDisponivelController {

    constructor(
        @inject('HorarioDisponivelService') private horarioDisponivelService: HorarioDisponivelService
    ) { }

    async create(req: Request, res: Response) {
        const { profissionalId } = req.params;

        const data = { ...req.body, profissionalId };
        const horario = await this.horarioDisponivelService.create(data, req.usuario);
        res.status(201).json(horario);
    }

    async findByProfissionalId(req: Request, res: Response) {
        const { profissionalId } = req.params;
        const horarios = await this.horarioDisponivelService.findByProfissionalId(profissionalId, req.usuario);
        res.status(200).json(horarios);
    }

    async delete(req: Request, res: Response) {
        // O ID do horário a ser deletado vem no corpo da requisição ou parâmetro de URL.
        // Vamos usar o id do horário que vem no parâmetro da URL da rota específica de delete.
        const { id } = req.params;
        await this.horarioDisponivelService.delete(id);
        res.status(204).send();
    }
}