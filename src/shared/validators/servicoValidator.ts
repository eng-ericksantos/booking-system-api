import { z } from 'zod';

export const createServicoSchema = z.object({
    body: z.object({
        // Para strings, definimos as regras de tamanho mínimo
        nome: z.string().min(3, { message: 'O nome do serviço deve ter no mínimo 3 caracteres.' }),
        descricao: z.string().min(1, { message: 'A descrição é obrigatória.' }),

        // Para números, primeiro garantimos que é um número.
        // Zod cuidará da mensagem de erro de tipo.
        // Em seguida, adicionamos regras específicas com mensagens customizadas.
        preco: z.number().positive({ message: 'O preço deve ser um valor positivo.' }),

        duracao: z.number()
            .int({ message: 'A duração deve ser um número inteiro.' })
            .positive({ message: 'A duração deve ser um valor positivo.' }),
    }),
});