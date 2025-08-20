import { inject, injectable, singleton } from 'tsyringe';
import ServicoRepository, { ServicoCreateDTO } from '../repositories/ServicoRepository';

@singleton()
@injectable()
export default class ServicoService {

    constructor(
        @inject('ServicoRepository') private servicoRepository: ServicoRepository
    ) { }

    async findAll() {
        return await this.servicoRepository.findAll();
    }

    async findById(id: string) {
        const servico = await this.servicoRepository.findById(id);
        if (!servico) {
            throw new Error('Serviço não encontrado');
        }
        return servico;
    }

    async create(servicoData: ServicoCreateDTO) {
        if (servicoData.preco < 0) {
            throw new Error('O preço do serviço não pode ser negativo.');
        }
        return await this.servicoRepository.create(servicoData);
    }

    async update(id: string, servicoData: Partial<ServicoCreateDTO>) {
        await this.findById(id);
        return await this.servicoRepository.update(id, servicoData);
    }

    async delete(id: string) {
        await this.findById(id);
        return await this.servicoRepository.delete(id);
    }
}