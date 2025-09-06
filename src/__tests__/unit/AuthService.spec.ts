import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

import AuthService from '../../services/AuthService';
import UsuarioRepository from '../../repositories/UsuarioRepository';

// Mantemos o mock automático, que é simples e poderoso.
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../repositories/UsuarioRepository');

// Criamos nosso mock do repositório como antes.
const mockUsuarioRepository = new UsuarioRepository() as jest.Mocked<UsuarioRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('Testes de Unidade para AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.resetAllMocks();
        authService = new AuthService(mockUsuarioRepository);
    });

    it('deve ser capaz de autenticar um usuário com credenciais válidas', async () => {
        const senhaHash = 'senha_hasheada_qualquer';
        const usuarioMock = {
            id: 'user-id-123',
            email: 'teste@example.com',
            senha: senhaHash,
            role: Role.PROFISSIONAL,
        };
        const tokenEsperado = 'token-jwt-fake';

        mockUsuarioRepository.findByEmail.mockResolvedValue(usuarioMock);
        mockBcrypt.compare.mockResolvedValue(true as never);

        // --- A CORREÇÃO DEFINITIVA ESTÁ AQUI ---
        // Acessamos diretamente o 'jwt.sign' (que agora é um mock)
        // e o tratamos como uma função mockada do Jest para definir seu valor de retorno.
        (jwt.sign as jest.Mock).mockReturnValue(tokenEsperado);

        const resultado = await authService.login({
            email: 'teste@example.com',
            senha: 'senha_correta',
        });

        expect(resultado.token).toBe(tokenEsperado);
        expect(mockUsuarioRepository.findByEmail).toHaveBeenCalledWith('teste@example.com');
        expect(mockBcrypt.compare).toHaveBeenCalledWith('senha_correta', senhaHash);
    });

    it('NÃO deve autenticar um usuário com senha incorreta', async () => {
        const senhaHash = 'senha_hasheada_qualquer';
        const usuarioMock = {
            id: 'user-id-123',
            email: 'teste@example.com',
            senha: senhaHash,
            role: Role.PROFISSIONAL,
        };

        mockUsuarioRepository.findByEmail.mockResolvedValue(usuarioMock);
        mockBcrypt.compare.mockResolvedValue(false as never);

        await expect(authService.login({
            email: 'teste@example.com',
            senha: 'senha_incorreta',
        })).rejects.toThrow('E-mail ou senha inválidos.');
    });

    it('NÃO deve autenticar um usuário que não existe', async () => {
        mockUsuarioRepository.findByEmail.mockResolvedValue(null);

        await expect(authService.login({
            email: 'nao.existe@example.com',
            senha: 'qualquer_senha',
        })).rejects.toThrow('E-mail ou senha inválidos.');
    });
});