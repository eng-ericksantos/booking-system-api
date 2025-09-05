import { singleton, injectable } from 'tsyringe';
import { prisma } from '../shared/prisma';

@singleton()
@injectable()
export default class OneTimePasswordRepository {
    public async create(data: { email: string, code: string, expiresAt: Date }) {
        return prisma.oneTimePassword.create({ data });
    }

    public async findByEmailAndCode(email: string, code: string) {
        return prisma.oneTimePassword.findFirst({
            where: {
                email,
                code,
            },
        });
    }

    public async delete(id: string) {
        return prisma.oneTimePassword.delete({
            where: { id },
        });
    }
}