import HorarioDisponivelRepository, { HorarioCreateDTO } from '../repositories/HorarioDisponivelRepository';
import ProfissionalService from './ProfissionalService';

class HorarioDisponivelService {
    async findByProfissionalId(profissionalId: string) {
        await ProfissionalService.findById(profissionalId);
        return await HorarioDisponivelRepository.findByProfissionalId(profissionalId);
    }

    async create(data: HorarioCreateDTO) {
        const { profissionalId, diaDaSemana, horaInicio, horaFim } = data;

        await ProfissionalService.findById(profissionalId);

        const horariosExistentes = await HorarioDisponivelRepository.findByProfissionalAndDia(
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
        return await HorarioDisponivelRepository.create(data);
    }

    async delete(id: string) {
        // Adicionar uma lógica para checar se o horário existe antes de deletar
        return await HorarioDisponivelRepository.delete(id);
    }
}

export default new HorarioDisponivelService();