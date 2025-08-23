import ProfissionalRepository from '../repositories/ProfissionalRepository';
import bcrypt from 'bcryptjs';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { inject, injectable, singleton } from 'tsyringe';
import { Role } from '@prisma/client';
import { IAuthenticatedUser } from '../models/interfaces/IAuthenticatedUser.interface';
import { ProfissionalDTO } from '../models/dtos/Profissional.dto';

@singleton()
@injectable()
export default class ProfissionalService {

    constructor(
        @inject('ProfissionalRepository') private profissionalRepository: ProfissionalRepository,
        @inject('UsuarioRepository') private usuarioRepository: UsuarioRepository
    ) { }

    async findAll(usuarioLogado: IAuthenticatedUser) {
        if (usuarioLogado.role !== Role.ADMIN) {
            throw new Error('Acesso negado. Apenas administradores podem listar todos os profissionais.');
        }

        return await this.profissionalRepository.findAll();
    }

    async findById(id: string, usuarioLogado: IAuthenticatedUser) {
        const profissional = await this.profissionalRepository.findById(id);

        if (!profissional) {
            throw new Error('Profissional não encontrado');
        }

        // REGRA DE NEGÓCIO:
        // Permite o acesso se:
        // 1. O usuário logado for um ADMIN.
        // 2. O 'usuarioId' do profissional que está sendo buscado for o mesmo do usuário logado.
        if (usuarioLogado.role !== Role.ADMIN && profissional.usuarioId !== usuarioLogado.id) {
            throw new Error('Acesso negado. Você não tem permissão para ver este perfil.');
        }

        return profissional;
    }

    async create(data: ProfissionalDTO) {
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

    async update(id: string, data: Partial<ProfissionalDTO>, usuarioLogado: IAuthenticatedUser) {
        await this.findById(id, usuarioLogado);
        return await this.profissionalRepository.update(id, data);
    }

    async delete(id: string, usuarioLogado: IAuthenticatedUser) {
        await this.findById(id, usuarioLogado);
        return await this.profissionalRepository.delete(id);
    }
}