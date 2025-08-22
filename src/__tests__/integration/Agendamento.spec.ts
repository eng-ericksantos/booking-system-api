import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Testes para a Rota de Agendamentos', () => {
    let adminToken: string;
    let profissionalId: string;
    let servicoId: string;
    let agendamentoId: string;

    beforeAll(async () => {
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.servico.deleteMany();
        await prisma.usuario.deleteMany();

        const senhaHash = await bcrypt.hash('admin_agendamento_test', 8);
        await prisma.usuario.create({
            data: { email: 'admin.agendamento.test@example.com', senha: senhaHash, role: 'ADMIN' }
        });

        const loginResponse = await request(app).post('/api/login').send({ email: 'admin.agendamento.test@example.com', senha: 'admin_agendamento_test' });
        adminToken = loginResponse.body.token;

        const profissional = await prisma.profissional.create({
            data: { nome: 'Profissional de Teste Agendamento', usuario: { create: { email: 'prof.agendamento@example.com', senha: await bcrypt.hash('123', 8) } } }
        });
        profissionalId = profissional.id;

        const servico = await prisma.servico.create({
            data: { nome: 'Serviço de Teste', descricao: 'Desc', preco: 100, duracao: 60 }
        });
        servicoId = servico.id;

        await prisma.horarioDisponivel.create({
            data: { diaDaSemana: 2, horaInicio: '09:00', horaFim: '18:00', profissionalId } // Profissional trabalha na Terça (2)
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('deve ser capaz de criar um agendamento válido', async () => {
        // --- LÓGICA DE DATA CORRIGIDA ---
        const hoje = new Date();
        // Move a data para o início do dia em UTC para evitar problemas de fuso
        const inicioDoDiaUTC = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));

        const diaDaSemanaAgendamento = 2; // Terça-feira
        const diasAteProximaTerca = (diaDaSemanaAgendamento - inicioDoDiaUTC.getUTCDay() + 7) % 7;
        // Se hoje for terça, agenda para a próxima semana para garantir que seja no futuro
        const offset = diasAteProximaTerca === 0 ? 7 : diasAteProximaTerca;

        const dataAgendamento = new Date(inicioDoDiaUTC);
        dataAgendamento.setUTCDate(inicioDoDiaUTC.getUTCDate() + offset);
        dataAgendamento.setUTCHours(14, 0, 0, 0); // Agendando para as 14:00 UTC da próxima terça

        const response = await request(app)
            .post('/api/agendamentos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                servicoId,
                profissionalId,
                nomeCliente: 'Cliente Teste',
                telefoneCliente: '11999999999',
                data: dataAgendamento.toISOString(),
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        agendamentoId = response.body.id;
    });

    it('NÃO deve ser capaz de criar um agendamento no mesmo horário', async () => {
        const hoje = new Date();
        const inicioDoDiaUTC = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
        const diaDaSemanaAgendamento = 2;
        const diasAteProximaTerca = (diaDaSemanaAgendamento - inicioDoDiaUTC.getUTCDay() + 7) % 7;
        const offset = diasAteProximaTerca === 0 ? 7 : diasAteProximaTerca;
        const dataAgendamento = new Date(inicioDoDiaUTC);
        dataAgendamento.setUTCDate(inicioDoDiaUTC.getUTCDate() + offset);
        dataAgendamento.setUTCHours(14, 0, 0, 0); // Mesmo horário

        const response = await request(app)
            .post('/api/agendamentos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                servicoId,
                profissionalId,
                nomeCliente: 'Outro Cliente',
                telefoneCliente: '11888888888',
                data: dataAgendamento.toISOString(),
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('indisponível');
    });

    it('deve ser capaz de listar os agendamentos', async () => {
        const response = await request(app)
            .get('/api/agendamentos')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(agendamentoId);
    });

    it('deve ser capaz de atualizar o status de um agendamento', async () => {
        const response = await request(app)
            .patch(`/api/agendamentos/${agendamentoId}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ status: 'Realizado' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Realizado');
    });
});