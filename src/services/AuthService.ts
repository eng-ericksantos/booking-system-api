import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository';

type LoginDTO = {
    email: string;
    senha: string;
};

class AuthService {
    async login({ email, senha }: LoginDTO) {
        const usuario = await UsuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new Error('E-mail ou senha inválidos.');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos.');
        }

        // --- SOLUÇÃO DEFINITIVA PARA expiresIn ---

        const secret: Secret = process.env.JWT_SECRET || '';

        // 1. Lemos a variável de ambiente para segundos e a convertemos para número.
        //    Fornecemos um padrão de 86400 segundos (1 dia) se não for definida.
        const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS || '86400', 10);

        if (!secret) {
            console.error('ERRO FATAL: JWT_SECRET não foi definido no arquivo .env');
            throw new Error('Erro de configuração interna do servidor.');
        }

        const payload = {
            id: usuario.id,
            role: usuario.role,
        };

        // 2. Passamos o valor NUMÉRICO para expiresIn.
        // Isso evita o erro de tipo 'StringValue' de uma vez por todas.
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

export default new AuthService();