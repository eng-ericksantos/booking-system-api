import { StatusAgendamento } from '@prisma/client';
import { injectable, singleton } from 'tsyringe';
import { prisma } from '../shared/prisma';

// export type AgendamentoCreateDTO = Omit<Agendamento, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'nomeCliente' | 'telefoneCliente'> & {
//   clienteId: string;
// };

export type AgendamentoCreateDTO = {
  data: Date;
  servicoId: string;
  profissionalId: string;
  clienteId: string;
};
@singleton()
@injectable()
export default class AgendamentoRepository {

  async create(data: AgendamentoCreateDTO) {
    return await prisma.agendamento.create({
      data,
      include: {
        profissional: {
          select: { nome: true }
        },
        servico: true,
        cliente: {
          select: { nome: true }
        }
      }
    });
  }

  // Busca agendamentos de um profissional que conflitem com um determinado intervalo de tempo
  async findConflictingAgendamento(profissionalId: string, dataInicio: Date, dataFim: Date) {
    return await prisma.agendamento.findFirst({
      where: {
        profissionalId: profissionalId,
        status: { not: 'Cancelado' }, // Não considerar agendamentos cancelados como conflito
        // A lógica de conflito:
        // Um conflito existe se um agendamento existente:
        // - Começa durante o novo agendamento OU
        // - Termina durante o novo agendamento OU
        // - Envolve completamente o novo agendamento
        OR: [
          {
            data: {
              gte: dataInicio,
              lt: dataFim,
            },
          },
        ],
      },
    });
  }

  async findAll() {
    return await prisma.agendamento.findMany({
      include: {
        servico: true,
        profissional: true,
        cliente: true,
      }
    });
  }

  async updateStatus(id: string, status: StatusAgendamento) {
    return await prisma.agendamento.update({
      where: { id },
      data: { status }
    });
  }

  async findById(id: string) {
    const agendamento = await prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      throw new Error("Agendamento não encontrado.");
    }
    return agendamento;
  }
}