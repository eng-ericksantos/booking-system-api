import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Testes para a Rota de Autenticação', () => {
    // Prepara o banco de dados antes de todos os testes neste arquivo
    beforeAll(async () => {
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();

        // Cria um usuário de teste diretamente no banco para testar o login
        const senhaHash = await bcrypt.hash('senha_correta_123', 8);
        await prisma.usuario.create({
            data: {
                email: 'usuario.login.test@example.com',
                senha: senhaHash,
                role: 'PROFISSIONAL',
            },
        });
    });

    // Desconecta do banco após todos os testes
    afterAll(async () => {
        await prisma.$disconnect();
    });


    it('deve ser capaz de autenticar um usuário com credenciais válidas', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'usuario.login.test@example.com',
                senha: 'senha_correta_123',
            });

        // Espera uma resposta de sucesso
        expect(response.status).toBe(200);

        // Espera que a resposta contenha o objeto do usuário e um token
        expect(response.body).toHaveProperty('usuario');
        expect(response.body).toHaveProperty('token');

        // Garante que a senha NUNCA é retornada
        expect(response.body.usuario).not.toHaveProperty('senha');
    });

    it('NÃO deve autenticar um usuário com uma senha incorreta', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'usuario.login.test@example.com',
                senha: 'senha_incorreta',
            });

        // Espera um erro de "Não Autorizado"
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('E-mail ou senha inválidos.');
    });

    it('NÃO deve autenticar um usuário com um e-mail não existente', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({
                email: 'nao.existe@example.com',
                senha: 'qualquer_senha',
            });

        // Espera um erro de "Não Autorizado"
        expect(response.status).toBe(401);
        // A mensagem de erro deve ser genérica para não informar quais e-mails existem no sistema
        expect(response.body.error).toBe('E-mail ou senha inválidos.');
    });
});