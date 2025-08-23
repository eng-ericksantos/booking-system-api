import { inject, injectable, singleton } from 'tsyringe';
import { HorarioDisponivelDTO } from '../models/dtos/HorarioDisponivel.dto';
import { IAuthenticatedUser } from '../models/interfaces/IAuthenticatedUser.interface';
import HorarioDisponivelRepository from '../repositories/HorarioDisponivelRepository';
import ProfissionalService from './ProfissionalService';

@singleton()
@injectable()
export default class HorarioDisponivelService {

    constructor(
        @inject('HorarioDisponivelRepository') private horarioDisponivelRepository: HorarioDisponivelRepository,
        @inject('ProfissionalService') private profissionalService: ProfissionalService
    ) { }

    async findByProfissionalId(profissionalId: string, usuarioLogado: IAuthenticatedUser) {
        await this.profissionalService.findById(profissionalId, usuarioLogado);
        return await this.horarioDisponivelRepository.findByProfissionalId(profissionalId);
    }

    async create(data: HorarioDisponivelDTO, usuarioLogado: IAuthenticatedUser) {
        const { profissionalId, diaDaSemana, horaInicio, horaFim } = data;

        await this.profissionalService.findById(profissionalId, usuarioLogado);

        const horariosExistentes = await this.horarioDisponivelRepository.findByProfissionalAndDia(
            profissionalId,
            diaDaSemana
        );

        const novoHorarioConflita = horariosExistentes.some(existente =>
            (horaInicio < existente.horaFim) && (horaFim > existente.horaInicio)
        );

        if (novoHorarioConflita) {
            throw new Error('O horário informado está sobreposto a um horário já cadastrado para este dia.');
        }

        // Se tudo estiver certo, cria o horário
        return await this.horarioDisponivelRepository.create(data);
    }

    async delete(id: string) {
        // 1. Verifica se o horário que se quer deletar realmente existe
        const horarioExiste = await this.horarioDisponivelRepository.findById(id);

        // 2. Se não existir, lança um erro claro
        if (!horarioExiste) {
            throw new Error('Horário não encontrado.');
        }

        // 3. Se existir, prossegue com a deleção
        await this.horarioDisponivelRepository.delete(id);
    }
}