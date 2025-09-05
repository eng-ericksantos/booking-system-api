import { singleton, injectable, inject } from 'tsyringe';
import { addMinutes } from 'date-fns';
import jwt, { Secret } from 'jsonwebtoken';

import OneTimePasswordRepository from '../repositories/OneTimePasswordRepository';
import UsuarioRepository from '../repositories/UsuarioRepository';
import ClienteRepository from '../repositories/ClienteRepository';
import { IMailProvider } from '../models/interfaces/IMailProvider.interface';

interface IVerifyOtpDTO {
    email: string;
    code: string;
    nome?: string;
    telefone?: string;
}

@singleton()
@injectable()
export default class ClienteAuthService {
    constructor(
        @inject('OneTimePasswordRepository') private otpRepository: OneTimePasswordRepository,
        @inject('UsuarioRepository') private usuarioRepository: UsuarioRepository,
        @inject('ClienteRepository') private clienteRepository: ClienteRepository,
        @inject('MailProvider') private mailProvider: IMailProvider
    ) { }

    public async generateOtp(email: string): Promise<void> {
        // 1. Gera um código aleatório de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Define a data de expiração (10 minutos a partir de agora)
        const expiresAt = addMinutes(new Date(), 10);

        // 3. Salva o OTP no banco de dados
        await this.otpRepository.create({ email, code, expiresAt });

        // 4. Envia o e-mail para o cliente
        await this.mailProvider.sendMail({
            to: email,
            subject: 'Seu código de acesso para o Booking System',
            body: `<p>Olá!</p><p>Seu código de acesso é: <strong>${code}</strong></p><p>Ele é válido por 10 minutos.</p>`,
        });
    }

    public async verifyOtp({ email, code, nome, telefone }: IVerifyOtpDTO) {
        const otp = await this.otpRepository.findByEmailAndCode(email, code);

        if (!otp) { throw new Error('Código OTP inválido.'); }

        if (new Date() > otp.expiresAt) {
            await this.otpRepository.delete(otp.id);
            throw new Error('Código OTP expirado. Por favor, solicite um novo.');
        }

        await this.otpRepository.delete(otp.id);
        let usuario = await this.usuarioRepository.findByEmail(email);

        if (!usuario) {
            if (!nome || !telefone) {
                throw new Error('Nome e telefone são obrigatórios para o primeiro acesso.');
            }
            const novoUsuario = await this.clienteRepository.create({
                nome,
                telefone,
                usuario: { create: { email, role: 'CLIENTE' } },
            });
            usuario = novoUsuario; // Atribui o usuário recém-criado
        }

        if (!usuario) { // Checagem de segurança caso algo dê errado
            throw new Error('Não foi possível encontrar ou criar o usuário.');
        }

        // 5. Gera e retorna o token JWT para o cliente
        const secret: Secret = process.env.JWT_SECRET || '';
        const expiresInSeconds = parseInt(process.env.JWT_EXPIRES_IN_SECONDS_FOR_CLIENT || '2592000', 10);

        if (!secret) { throw new Error('O segredo JWT não está configurado.'); }

        const payload = {
            id: usuario.id,
            role: usuario.role,
        };

        const options = {
            expiresIn: expiresInSeconds,
        };

        const token = jwt.sign(payload, secret, options);

        const { senha: _, ...usuarioSemSenha } = usuario;

        return { usuario: usuarioSemSenha, token };
    }
}