import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../app';
import { prisma } from '../../shared/prisma';
import bcrypt from 'bcryptjs';

describe('Testes para a Rota de Serviços', () => {
    let adminToken: string;
    let servicoId: string;

    // Antes de todos os testes, criamos um usuário ADMIN, fazemos login para obter o token,
    // e limpamos o banco de dados para garantir um estado inicial limpo.
    beforeAll(async () => {
        // Limpeza completa para evitar conflitos entre arquivos de teste
        await prisma.agendamento.deleteMany();
        await prisma.horarioDisponivel.deleteMany();
        await prisma.profissional.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.servico.deleteMany();

        const senhaHash = await bcrypt.hash('admin_password_test', 8);
        await prisma.usuario.create({
            data: {
                email: 'admin.servico.test@example.com',
                senha: senhaHash,
                role: 'ADMIN',
            },
        });

        const loginResponse = await request(app)
            .post('/api/login')
            .send({
                email: 'admin.servico.test@example.com',
                senha: 'admin_password_test',
            });

        adminToken = loginResponse.body.token;
    });

    // Fecha a conexão com o banco após todos os testes
    afterAll(async () => {
        await prisma.$disconnect();
    });


    it('deve retornar 401 ao tentar criar um serviço sem autenticação', async () => {
        const response = await request(app)
            .post('/api/servicos')
            .send({
                nome: 'Corte de Cabelo',
                descricao: 'Corte masculino com máquina e tesoura.',
                preco: 50,
                duracao: 30,
            });

        expect(response.status).toBe(401);
    });

    it('deve ser capaz de criar um novo serviço QUANDO autenticado', async () => {
        const response = await request(app)
            .post('/api/servicos')
            .set('Authorization', `Bearer ${adminToken}`) // Usa o token de autenticação
            .send({
                nome: 'Corte de Cabelo',
                descricao: 'Corte masculino com máquina e tesoura.',
                preco: 50,
                duracao: 30,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        servicoId = response.body.id; // Salva o ID para os próximos testes
    });

    it('deve ser capaz de listar todos os serviços', async () => {
        const response = await request(app)
            .get('/api/servicos')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0); // Espera que haja pelo menos 1 serviço
    });

    it('deve ser capaz de buscar um serviço específico pelo ID', async () => {
        const response = await request(app)
            .get(`/api/servicos/${servicoId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(servicoId);
        expect(response.body.nome).toBe('Corte de Cabelo');
    });

    it('deve ser capaz de atualizar um serviço', async () => {
        const response = await request(app)
            .put(`/api/servicos/${servicoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                nome: 'Corte de Cabelo e Barba',
                descricao: 'Pacote completo de corte de cabelo e barba.',
                preco: 90,
                duracao: 60,
            });

        expect(response.status).toBe(200);
        expect(response.body.preco).toBe(90);
        expect(response.body.nome).toBe('Corte de Cabelo e Barba');
    });

    it('deve ser capaz de deletar um serviço', async () => {
        // Deleta o serviço
        const deleteResponse = await request(app)
            .delete(`/api/servicos/${servicoId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(deleteResponse.status).toBe(204);

        // Tenta buscar o serviço deletado para confirmar que não existe mais
        const getResponse = await request(app)
            .get(`/api/servicos/${servicoId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(getResponse.status).toBe(404); // Espera 'Not Found'
    });
});