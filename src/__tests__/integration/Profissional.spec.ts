import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Rotas de Profissionais', () => {
    let adminToken: string;
    let profissionalToken: string;
    let profissionalId: string;
    let outroProfissionalId: string;

    beforeAll(async () => {
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();

        // Cria usuário ADMIN e faz login
        const senhaHashAdmin = await bcrypt.hash('admin_password_test', 8);
        await prisma.usuario.create({
            data: { email: 'admin.prof.test@example.com', senha: senhaHashAdmin, role: 'ADMIN' }
        });
        const loginAdminResponse = await request(app).post('/api/login').send({ email: 'admin.prof.test@example.com', senha: 'admin_password_test' });
        adminToken = loginAdminResponse.body.token;

        // Admin cria o primeiro profissional (Profissional A)
        const profAResponse = await request(app).post('/api/profissionais').set('Authorization', `Bearer ${adminToken}`).send({ nome: 'Profissional A', email: 'prof.a@example.com', senha: 'senha123' });
        profissionalId = profAResponse.body.id;

        // Admin cria o segundo profissional (Profissional B)
        const profBResponse = await request(app).post('/api/profissionais').set('Authorization', `Bearer ${adminToken}`).send({ nome: 'Profissional B', email: 'prof.b@example.com', senha: 'senha123' });
        outroProfissionalId = profBResponse.body.id;

        // Faz login como o primeiro profissional (Profissional A)
        const loginProfResponse = await request(app).post('/api/login').send({ email: 'prof.a@example.com', senha: 'senha123' });
        profissionalToken = loginProfResponse.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('um PROFISSIONAL deve ser capaz de ver seu próprio perfil', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${profissionalId}`)
            .set('Authorization', `Bearer ${profissionalToken}`); // Usando token do Profissional A

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(profissionalId);
    });

    it('NÃO deve permitir que um PROFISSIONAL veja o perfil de outro profissional', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${outroProfissionalId}`) // Tentando ver o Profissional B
            .set('Authorization', `Bearer ${profissionalToken}`); // Usando token do Profissional A

        expect(response.status).toBe(403); // Forbidden
        expect(response.body.error).toContain('Acesso negado');
    });

    it('um ADMIN deve ser capaz de ver o perfil de qualquer profissional', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${outroProfissionalId}`) // Admin vendo o Profissional B
            .set('Authorization', `Bearer ${adminToken}`); // Usando token de ADMIN

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(outroProfissionalId);
    });

    it('NÃO deve permitir que um PROFISSIONAL liste todos os profissionais', async () => {
        const response = await request(app)
            .get('/api/profissionais')
            .set('Authorization', `Bearer ${profissionalToken}`);

        expect(response.status).toBe(403); // Forbidden
    });

    it('um ADMIN deve ser capaz de listar todos os profissionais', async () => {
        const response = await request(app)
            .get('/api/profissionais')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
});