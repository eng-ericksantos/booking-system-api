import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Rotas de Profissionais', () => {
    let adminToken: string;

    // Antes de todos os testes, criamos um usuário ADMIN e fazemos login para obter o token
    beforeAll(async () => {
        // Limpa o banco para garantir um estado inicial limpo
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();

        // Cria o usuário ADMIN no banco de dados de teste
        const senhaHash = await bcrypt.hash('admin_password_test', 8);
        await prisma.usuario.create({
            data: {
                email: 'admin.test@example.com',
                senha: senhaHash,
                role: 'ADMIN',
            },
        });

        // Faz o login para obter o token
        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: 'admin.test@example.com',
                senha: 'admin_password_test',
            });

        adminToken = loginResponse.body.token; // Salva o token para usar nos testes
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('deve ser capaz de criar um novo profissional QUANDO autenticado como ADMIN', async () => {
        const response = await request(app)
            .post('/api/profissionais')
            .set('Authorization', `Bearer ${adminToken}`) // Usa o token de ADMIN
            .send({
                nome: 'Dr. Teste',
                email: 'dr.teste@example.com',
                senha: 'senha123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.usuario.email).toBe('dr.teste@example.com');
    });

    it('NÃO deve ser capaz de criar um profissional sem um token', async () => {
        const response = await request(app)
            .post('/api/profissionais')
            .send({
                nome: 'Dr. Sem Token',
                email: 'sem.token@example.com',
                senha: 'senha123',
            });

        expect(response.status).toBe(401); // Espera falha por falta de autenticação
    });

    it('deve ser capaz de listar todos os profissionais QUANDO autenticado', async () => {
        const response = await request(app)
            .get('/api/profissionais')
            .set('Authorization', `Bearer ${adminToken}`); // Usa o token de ADMIN

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});