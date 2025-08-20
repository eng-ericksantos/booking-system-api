import { Request, Response } from 'express';
import ProfissionalService from '../services/ProfissionalService';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class ProfissionalController {

    constructor(
        @inject('ProfissionalService') private profissionalService: ProfissionalService
    ) { }

    async create(req: Request, res: Response) {
        const profissional = await this.profissionalService.create(req.body);
        res.status(201).json(profissional);
    }

    async findAll(req: Request, res: Response) {
        const profissionais = await this.profissionalService.findAll();
        res.status(200).json(profissionais);
    }

    async findById(req: Request, res: Response) {
        const profissional = await this.profissionalService.findById(req.params.id);
        res.status(200).json(profissional);
    }

    async update(req: Request, res: Response) {
        const profissional = await this.profissionalService.update(req.params.id, req.body);
        res.status(200).json(profissional);
    }

    async delete(req: Request, res: Response) {
        await this.profissionalService.delete(req.params.id);
        res.status(204).send();
    }
}