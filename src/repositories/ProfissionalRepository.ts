import { prisma } from '../shared/prisma';
import { Profissional } from '@prisma/client';

// export type ProfissionalCreateDTO = Omit<Profissional, 'id'>;
export type ProfissionalComUsuarioCreateDTO = {
    nome: string;
    usuario: {
        email: string;
        senhaHash: string; // receber a senha já criptografada
    }
};

export type ProfissionalUpdateData = {
    nome?: string;
    usuario?: {
        update: {
            email?: string;
            senhaHash?: string;
        }
    }
};

class ProfissionalRepository {
    async findAll() {
        return await prisma.profissional.findMany({
            include: {
                usuario: { select: { email: true, role: true } }
            }
        });
    }

    async findById(id: string) {
        return await prisma.profissional.findUnique({ where: { id } });
    }

    async create(data: ProfissionalComUsuarioCreateDTO) {
        return await prisma.profissional.create({
            data: {
                nome: data.nome,
                usuario: {
                    create: {
                        email: data.usuario.email,
                        senha: data.usuario.senhaHash,
                        role: 'PROFISSIONAL',
                    },
                },
            },
            include: {
                usuario: {
                    select: { id: true, email: true, role: true } // Nunca retornar a senha
                }
            }
        });
    }

    async update(id: string, data: Partial<ProfissionalUpdateData>) {
        return await prisma.profissional.update({
            where: { id },
            data,
            include: {
                usuario: {
                    select: { id: true, email: true, role: true }
                }
            }
        });
    }

    async delete(id: string) {
        // Lembre-se que deletar um profissional exigirá deletar o usuário também.
        // Isso pode ser feito com uma transação. Por enquanto, vamos deixar como está.
        return await prisma.profissional.delete({ where: { id } });
    }
}

export default new ProfissionalRepository();