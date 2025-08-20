import { Servico } from "@prisma/client";
import { prisma } from "../shared/prisma";
import { injectable, singleton } from "tsyringe";

// DTO (Data Transfer Object) para a criação de um serviço.
export type ServicoCreateDTO = Omit<Servico, 'id'>;
@singleton()
@injectable()
export default class ServicoRepository {

    async findAll() {
        return await prisma.servico.findMany();
    }

    async findById(id: string) {
        return await prisma.servico.findUnique({
            where: { id }
        });
    }

    async create(servicoData: ServicoCreateDTO) {
        return await prisma.servico.create({
            data: servicoData
        });
    }

    async update(id: string, servicoData: Partial<ServicoCreateDTO>) {
        return await prisma.servico.update({
            where: { id },
            data: servicoData
        });
    }

    async delete(id: string) {
        return await prisma.servico.delete({
            where: { id }
        });
    }
}