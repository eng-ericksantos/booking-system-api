import { z } from 'zod';
import { StatusAgendamento } from '@prisma/client';

export const createAgendamentoSchema = z.object({
    body: z.object({
        servicoId: z.string().uuid({ message: 'ID do serviço é inválido.' }),
        profissionalId: z.string().uuid({ message: 'ID do profissional é inválido.' }),
        nomeCliente: z.string().min(3, { message: 'Nome do cliente é obrigatório.' }),
        telefoneCliente: z.string().min(10, { message: 'Telefone do cliente é inválido.' }),

        // Removemos o objeto de configuração. Se a data for inválida,
        // o Zod usará sua mensagem padrão, que será capturada pelo nosso errorHandler.
        data: z.coerce.date(),
    }),
});

export const updateAgendamentoStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid({ message: 'ID do agendamento é inválido.' }),
    }),
    body: z.object({
        // 1. Validamos que o campo é uma string.
        // 2. Usamos .refine() para criar uma validação customizada.
        // 3. A lógica (primeiro argumento) checa se o valor recebido existe na lista de valores do nosso Enum.
        // 4. A mensagem (segundo argumento) é o erro que será exibido se a lógica falhar.
        status: z.string().refine(
            (value) => Object.values(StatusAgendamento).includes(value as StatusAgendamento),
            { message: 'Status inválido. Use Confirmado, Cancelado ou Realizado.' }
        ),
    }),
});