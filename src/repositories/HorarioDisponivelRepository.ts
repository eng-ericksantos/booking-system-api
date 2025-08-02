import { prisma } from '../shared/prisma';
import { HorarioDisponivel } from '@prisma/client';

export type HorarioCreateDTO = Omit<HorarioDisponivel, 'id'>;

class HorarioDisponivelRepository {
    async findByProfissionalId(profissionalId: string) {
        return await prisma.horarioDisponivel.findMany({
            where: { profissionalId },
        });
    }

    async create(data: HorarioCreateDTO) {
        return await prisma.horarioDisponivel.create({ data });
    }

    async delete(id: string) {
        return await prisma.horarioDisponivel.delete({ where: { id } });
    }
}

export default new HorarioDisponivelRepository();