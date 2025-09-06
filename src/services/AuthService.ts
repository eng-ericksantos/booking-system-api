import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { inject, injectable, singleton } from 'tsyringe';
import UsuarioRepository from '../repositories/UsuarioRepository';
import { LoginDTO } from '../models/dtos/Login.dto';

@singleton()
@injectable()
export default class AuthService {

    constructor(
        @inject('UsuarioRepository') private usuarioRepository: UsuarioRepository // tsyringe injeta o UsuarioRepository
    ) { }

    async login({ email, senha }: LoginDTO) {

        const usuario = await this.usuarioRepository.findByEmail(email);
        if (!usuario || !usuario.senha) {
            throw new Error('E-mail ou senha inválidos.');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos.');
        }

        const secret: Secret = process.env.JWT_SECRET || '';

        // Lemos a variável de ambiente para segundos e a convertemos para número.
        // Fornece um padrão de 86400 segundos (1 dia) se não for definida.
        const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '86400', 10);

        if (!secret) {
            console.error('ERRO FATAL: JWT_SECRET não foi definido no arquivo .env');
            throw new Error('Erro de configuração interna do servidor.');
        }

        const payload = {
            id: usuario.id,
            role: usuario.role,
        };

        const options = {
            expiresIn: expiresInSeconds,
        };

        const token = jwt.sign(payload, secret, options);

        const { senha: _, ...usuarioLogado } = usuario;

        return {
            usuario: usuarioLogado,
            token,
        };
    }
}