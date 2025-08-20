import { injectable, singleton } from 'tsyringe';
import { prisma } from '../shared/prisma';


@singleton() // Garante uma única instância do repositório
@injectable() // Marca a classe como injetável
export default class UsuarioRepository {
    /**
     * Busca um usuário pelo seu endereço de e-mail.
     * Retorna o usuário completo, incluindo a senha, para ser usado na lógica de login.
     * @param email O e-mail do usuário a ser buscado.
     */
    async findByEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: { email },
        });
    }
}