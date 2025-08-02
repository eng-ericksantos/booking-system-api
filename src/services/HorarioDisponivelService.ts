import HorarioDisponivelRepository, { HorarioCreateDTO } from '../repositories/HorarioDisponivelRepository';
import ProfissionalService from './ProfissionalService';

class HorarioDisponivelService {
    async findByProfissionalId(profissionalId: string) {
        await ProfissionalService.findById(profissionalId);
        return await HorarioDisponivelRepository.findByProfissionalId(profissionalId);
    }

    async create(data: HorarioCreateDTO) {
        await ProfissionalService.findById(data.profissionalId);

        // Outras validações poderiam ser adicionadas aqui:
        // - Checar se diaDaSemana está entre 0 e 6
        // - Validar formato das horas
        // - Impedir horários sobrepostos para o mesmo profissional

        return await HorarioDisponivelRepository.create(data);
    }

    async delete(id: string) {
        // Poderíamos adicionar uma lógica para checar se o horário existe antes de deletar
        return await HorarioDisponivelRepository.delete(id);
    }
}

export default new HorarioDisponivelService();