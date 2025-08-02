import { Request, Response } from 'express';
import ProfissionalService from '../services/ProfissionalService';

class ProfissionalController {
    async create(req: Request, res: Response) {
        try {
            const profissional = await ProfissionalService.create(req.body);
            res.status(201).json(profissional);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const profissionais = await ProfissionalService.findAll();
            res.status(200).json(profissionais);
        } catch (error: any) {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const profissional = await ProfissionalService.findById(req.params.id);
            res.status(200).json(profissional);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const profissional = await ProfissionalService.update(req.params.id, req.body);
            res.status(200).json(profissional);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await ProfissionalService.delete(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default new ProfissionalController();