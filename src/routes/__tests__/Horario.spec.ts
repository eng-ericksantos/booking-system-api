import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Testes para a Rota de Horários Disponíveis', () => {
    let adminToken: string;
    let profissionalId: string;
    let horarioId: string;

    beforeAll(async () => {
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();

        const senhaHash = await bcrypt.hash('admin_horario_test', 8);
        await prisma.usuario.create({
            data: {
                email: 'admin.horario.test@example.com',
                senha: senhaHash,
                role: 'ADMIN',
            },
        });

        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: 'admin.horario.test@example.com',
                senha: 'admin_horario_test',
            });

        adminToken = loginResponse.body.token;

        const profissional = await prisma.profissional.create({
            data: {
                nome: 'Profissional Para Horários',
                usuario: {
                    create: {
                        email: 'prof.horario@example.com',
                        senha: await bcrypt.hash('123', 8),
                    }
                }
            }
        });
        profissionalId = profissional.id;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('deve ser capaz de criar um novo horário para um profissional', async () => {
        const response = await request(app)
            .post(`/api/profissionais/${profissionalId}/horarios`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ diaDaSemana: 2, horaInicio: '08:00', horaFim: '17:00' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        horarioId = response.body.id;
    });

    it('NÃO deve ser capaz de criar um horário que se sobrepõe a um existente', async () => {
        const response = await request(app)
            .post(`/api/profissionais/${profissionalId}/horarios`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ diaDaSemana: 2, horaInicio: '16:00', horaFim: '19:00' });

        expect(response.status).toBe(409);
        // CORREÇÃO AQUI: A chave da mensagem de erro é "message"
        expect(response.body.message).toContain('sobreposto');
    });

    it('deve ser capaz de listar os horários de um profissional', async () => {
        const response = await request(app)
            .get(`/api/profissionais/${profissionalId}/horarios`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
    });

    it('deve ser capaz de deletar um horário', async () => {
        const deleteResponse = await request(app)
            .delete(`/api/profissionais/${profissionalId}/horarios/${horarioId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/profissionais/${profissionalId}/horarios`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(getResponse.body.length).toBe(0);
    });
});