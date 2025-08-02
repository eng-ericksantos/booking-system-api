import ProfissionalRepository, { ProfissionalCreateDTO } from '../repositories/ProfissionalRepository';

class ProfissionalService {
    async findAll() {
        return await ProfissionalRepository.findAll();
    }

    async findById(id: string) {
        const profissional = await ProfissionalRepository.findById(id);
        if (!profissional) {
            throw new Error('Profissional não encontrado');
        }
        return profissional;
    }

    async create(data: ProfissionalCreateDTO) {
        const existingProfissional = await ProfissionalRepository.findByEmail(data.email);
        if (existingProfissional) {
            throw new Error('Este e-mail já está sendo utilizado por outro profissional.');
        }
        return await ProfissionalRepository.create(data);
    }

    async update(id: string, data: Partial<ProfissionalCreateDTO>) {
        await this.findById(id);
        return await ProfissionalRepository.update(id, data);
    }

    async delete(id: string) {
        await this.findById(id);
        return await ProfissionalRepository.delete(id);
    }
}

export default new ProfissionalService();