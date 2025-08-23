import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Rotas de Profissionais', () => {
    let adminToken: string;
    let profissionalToken_A: string;
    let profissionalId_A: string;
    let profissionalId_B: string;

    beforeAll(async () => {
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();

        const senhaHashAdmin = await bcrypt.hash('admin_password_test', 8);
        await prisma.usuario.create({
            data: { email: 'admin.prof.test@example.com', senha: senhaHashAdmin, role: 'ADMIN' }
        });
        const loginAdminResponse = await request(app).post('/api/login').send({ email: 'admin.prof.test@example.com', senha: 'admin_password_test' });
        adminToken = loginAdminResponse.body.token;

        const profAResponse = await request(app).post('/api/profissionais').set('Authorization', `Bearer ${adminToken}`).send({ nome: 'Profissional A', email: 'prof.a@example.com', senha: 'senha123' });
        profissionalId_A = profAResponse.body.id;

        const profBResponse = await request(app).post('/api/profissionais').set('Authorization', `Bearer ${adminToken}`).send({ nome: 'Profissional B', email: 'prof.b@example.com', senha: 'senha123' });
        profissionalId_B = profBResponse.body.id;

        const loginProfResponse = await request(app).post('/api/login').send({ email: 'prof.a@example.com', senha: 'senha123' });
        profissionalToken_A = loginProfResponse.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('um PROFISSIONAL deve ser capaz de ver seu próprio perfil', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${profissionalId_A}`)
            .set('Authorization', `Bearer ${profissionalToken_A}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(profissionalId_A);
    });

    it('NÃO deve permitir que um PROFISSIONAL veja o perfil de outro profissional', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${profissionalId_B}`)
            .set('Authorization', `Bearer ${profissionalToken_A}`);

        expect(response.status).toBe(403); // Forbidden

        // CORREÇÃO AQUI: A chave da resposta de erro é 'message', não 'error'.
        expect(response.body.message).toContain('Acesso negado');
    });

    it('um ADMIN deve ser capaz de ver o perfil de qualquer profissional', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${profissionalId_B}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(profissionalId_B);
    });

    it('NÃO deve permitir que um PROFISSIONAL liste todos os profissionais', async () => {
        const response = await request(app)
            .get('/api/profissionais')
            .set('Authorization', `Bearer ${profissionalToken_A}`);

        expect(response.status).toBe(403);
        // CORREÇÃO AQUI: A chave da resposta de erro é 'message', não 'error'.
        expect(response.body.message).toContain('Acesso negado');
    });

    it('um ADMIN deve ser capaz de listar todos os profissionais', async () => {
        const response = await request(app)
            .get('/api/profissionais')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
});