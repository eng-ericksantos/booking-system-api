import { Request, Response } from 'express';
import ProfissionalService from '../services/ProfissionalService';

class ProfissionalController {
    async create(req: Request, res: Response) {
        const profissional = await ProfissionalService.create(req.body);
        res.status(201).json(profissional);
    }

    async findAll(req: Request, res: Response) {
        const profissionais = await ProfissionalService.findAll();
        res.status(200).json(profissionais);
    }

    async findById(req: Request, res: Response) {
        const profissional = await ProfissionalService.findById(req.params.id);
        res.status(200).json(profissional);
    }

    async update(req: Request, res: Response) {
        const profissional = await ProfissionalService.update(req.params.id, req.body);
        res.status(200).json(profissional);
    }

    async delete(req: Request, res: Response) {
        await ProfissionalService.delete(req.params.id);
        res.status(204).send();
    }
}

export default new ProfissionalController();