import { prisma } from '../shared/prisma';
import { Profissional } from '@prisma/client';

export type ProfissionalCreateDTO = Omit<Profissional, 'id'>;

class ProfissionalRepository {
    async findAll() {
        return await prisma.profissional.findMany();
    }

    async findById(id: string) {
        return await prisma.profissional.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return await prisma.profissional.findUnique({ where: { email } });
    }

    async create(data: ProfissionalCreateDTO) {
        return await prisma.profissional.create({ data });
    }

    async update(id: string, data: Partial<ProfissionalCreateDTO>) {
        return await prisma.profissional.update({ where: { id }, data });
    }

    async delete(id: string) {
        return await prisma.profissional.delete({ where: { id } });
    }
}

export default new ProfissionalRepository();