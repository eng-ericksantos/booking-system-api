import { inject, injectable, singleton } from 'tsyringe';
import HorarioDisponivelRepository, { HorarioCreateDTO } from '../repositories/HorarioDisponivelRepository';
import ProfissionalService from './ProfissionalService';

@singleton()
@injectable()
export default class HorarioDisponivelService {

    constructor(
        @inject('HorarioDisponivelRepository') private horarioDisponivelRepository: HorarioDisponivelRepository,
        @inject('ProfissionalService') private profissionalService: ProfissionalService
    ) { }

    async findByProfissionalId(profissionalId: string) {
        await this.profissionalService.findById(profissionalId);
        return await this.horarioDisponivelRepository.findByProfissionalId(profissionalId);
    }

    async create(data: HorarioCreateDTO) {
        const { profissionalId, diaDaSemana, horaInicio, horaFim } = data;

        await this.profissionalService.findById(profissionalId);

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
        // TODO Adicionar uma lógica para checar se o horário existe antes de deletar
        return await this.horarioDisponivelRepository.delete(id);
    }
}