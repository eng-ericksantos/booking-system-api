import ProfissionalRepository from '../repositories/ProfissionalRepository';
import bcrypt from 'bcryptjs';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { inject, injectable, singleton } from 'tsyringe';

// Este DTO representa os dados que chegam da "borda" da aplicação (do controller).
// Ele contém a senha em texto plano.
export type ProfissionalRegistrationDTO = {
    nome: string;
    email: string;
    senha: string;
};

@singleton()
@injectable()
export default class ProfissionalService {

    constructor(
        @inject('ProfissionalRepository') private profissionalRepository: ProfissionalRepository,
        @inject('UsuarioRepository') private usuarioRepository: UsuarioRepository
    ) { }

    async findAll() {
        return await this.profissionalRepository.findAll();
    }

    async findById(id: string) {
        const profissional = await this.profissionalRepository.findById(id);
        if (!profissional) {
            throw new Error('Profissional não encontrado');
        }
        return profissional;
    }

    async create(data: ProfissionalRegistrationDTO) {
        // 1. Validar se o e-mail já existe na tabela de usuários
        const existingProfissional = await this.usuarioRepository.findByEmail(data.email);

        if (existingProfissional) {
            throw new Error('Este e-mail já está sendo utilizado por outro profissional.');
        }

        // 2. Criptografar a senha
        const senhaHash = await bcrypt.hash(data.senha, 8); // O 8 é o "custo" do hash

        // 3. Criar o usuário e o profissional em uma única transação
        // O Prisma garante que ou tudo funciona, ou nada é salvo.
        const novoProfissional = await this.profissionalRepository.create({
            nome: data.nome,
            usuario: {
                email: data.email,
                senhaHash: senhaHash,
            },
        });

        return novoProfissional;
    }

    async update(id: string, data: Partial<ProfissionalRegistrationDTO>) {
        await this.findById(id);
        return await this.profissionalRepository.update(id, data);
    }

    async delete(id: string) {
        await this.findById(id);
        return await this.profissionalRepository.delete(id);
    }
}