import { prisma } from '../shared/prisma';

class UsuarioRepository {
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

export default new UsuarioRepository();