import { addMinutes, getDay } from 'date-fns';
import AgendamentoRepository, { AgendamentoCreateDTO } from '../repositories/AgendamentoRepository';
import ServicoService from './ServicoService';
import ProfissionalService from './ProfissionalService';
import HorarioDisponivelRepository from '../repositories/HorarioDisponivelRepository';
import { StatusAgendamento } from '@prisma/client';
import { inject, injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export default class AgendamentoService {

    constructor(
        @inject('AgendamentoRepository') private agendamentoRepository: AgendamentoRepository,
        @inject('HorarioDisponivelRepository') private horarioDisponivelRepository: HorarioDisponivelRepository,
        @inject('ProfissionalService') private profissionalService: ProfissionalService,
        @inject('ServicoService') private servicoService: ServicoService
    ) { }

    public async findAll() {
        return await this.agendamentoRepository.findAll();
    }

    public async updateStatus(id: string, status: StatusAgendamento) {
        // Valida se o agendamento existe
        await this.agendamentoRepository.findById(id);
        return this.agendamentoRepository.updateStatus(id, status);
    }

    public async create(data: AgendamentoCreateDTO) {
        const { servicoId, profissionalId, data: dataAgendamento } = data;

        // --- 1. Validações de Existência ---
        const servico = await this.servicoService.findById(servicoId);
        await this.profissionalService.findById(profissionalId);

        // --- 2. Validação da Data/Hora do Agendamento ---
        const dataInicio = new Date(dataAgendamento);
        if (dataInicio < new Date()) {
            throw new Error('Não é possível agendar no passado.');
        }
        const dataFim = addMinutes(dataInicio, servico.duracao);

        // --- 3. Verificar Disponibilidade Geral do Profissional (HorarioDisponivel) ---
        const diaDaSemana = getDay(dataInicio); // Domingo = 0, Segunda = 1, etc.
        const horariosDoProfissional = await this.horarioDisponivelRepository.findByProfissionalId(profissionalId);

        const trabalhaNesteDia = horariosDoProfissional.some(h => h.diaDaSemana === diaDaSemana);
        if (!trabalhaNesteDia) {
            throw new Error('O profissional não atende neste dia da semana.');
        }

        // --- 4. Verificar Conflito com Outros Agendamentos ---
        const hasConflictingAgendamento = await this.agendamentoRepository.findConflictingAgendamento(profissionalId, dataInicio, dataFim);
        if (hasConflictingAgendamento) {
            throw new Error('Horário indisponível. Já existe outro agendamento neste período.');
        }

        // --- 5. Se todas as validações passaram, cria o agendamento ---
        return this.agendamentoRepository.create(data);
    }
}