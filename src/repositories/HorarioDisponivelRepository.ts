import { injectable, singleton } from 'tsyringe';
import { HorarioDisponivelDTO } from '../models/dtos/HorarioDisponivel.dto';
import { prisma } from '../shared/prisma';
@singleton()
@injectable()
export default class HorarioDisponivelRepository {
    async findByProfissionalId(profissionalId: string) {
        return await prisma.horarioDisponivel.findMany({
            where: { profissionalId },
        });
    }

    async create(data: HorarioDisponivelDTO) {
        return await prisma.horarioDisponivel.create({ data });
    }

    async delete(id: string) {
        return await prisma.horarioDisponivel.delete({ where: { id } });
    }

    async findById(id: string) {
        return prisma.horarioDisponivel.findUnique({
            where: { id },
        });
    }

    async findByProfissionalAndDia(profissionalId: string, diaDaSemana: number) {
        return await prisma.horarioDisponivel.findMany({
            where: {
                profissionalId,
                diaDaSemana,
            },
            orderBy: {
                horaInicio: 'asc',
            },
        });
    }
}