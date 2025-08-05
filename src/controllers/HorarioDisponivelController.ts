import { Request, Response } from 'express';
import HorarioDisponivelService from '../services/HorarioDisponivelService';

class HorarioDisponivelController {
    async create(req: Request, res: Response) {
        const { profissionalId } = req.params;

        const data = { ...req.body, profissionalId };
        const horario = await HorarioDisponivelService.create(data);
        res.status(201).json(horario);
    }

    async findByProfissionalId(req: Request, res: Response) {
        const { profissionalId } = req.params;
        const horarios = await HorarioDisponivelService.findByProfissionalId(profissionalId);
        res.status(200).json(horarios);
    }

    async delete(req: Request, res: Response) {
        // O ID do horário a ser deletado vem no corpo da requisição ou parâmetro de URL.
        // Vamos usar o id do horário que vem no parâmetro da URL da rota específica de delete.
        const { id } = req.params;
        await HorarioDisponivelService.delete(id);
        res.status(204).send();
    }
}

export default new HorarioDisponivelController();