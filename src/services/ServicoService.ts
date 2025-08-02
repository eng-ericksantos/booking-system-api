import ServicoRepository, { ServicoCreateDTO } from '../repositories/ServicoRepository';

class ServicoService {
    async findAll() {
        return await ServicoRepository.findAll();
    }

    async findById(id: string) {
        const servico = await ServicoRepository.findById(id);
        if (!servico) {
            throw new Error('Serviço não encontrado');
        }
        return servico;
    }

    async create(servicoData: ServicoCreateDTO) {
        if (servicoData.preco < 0) {
            throw new Error('O preço do serviço não pode ser negativo.');
        }
        return await ServicoRepository.create(servicoData);
    }

    async update(id: string, servicoData: Partial<ServicoCreateDTO>) {
        await this.findById(id);
        return await ServicoRepository.update(id, servicoData);
    }

    async delete(id: string) {
        await this.findById(id);
        return await ServicoRepository.delete(id);
    }
}

export default new ServicoService();