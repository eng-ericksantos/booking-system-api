import { singleton, injectable } from 'tsyringe';
import { prisma } from '../shared/prisma';

@singleton()
@injectable()
export default class ClienteRepository {

    public async create(data: { nome: string, telefone: string, usuario: { create: { email: string, role: 'CLIENTE' } } }) {
        // Retorna o usuário criado, não o cliente
        const cliente = await prisma.cliente.create({
            data: {
                nome: data.nome,
                telefone: data.telefone,
                usuario: data.usuario,
            },
            include: {
                usuario: true, // Inclui o usuário na resposta
            }
        });
        return cliente.usuario;
    }

    public async findByUsuarioId(usuarioId: string) {
        return prisma.cliente.findUnique({
            where: { usuarioId },
        });
    }
}