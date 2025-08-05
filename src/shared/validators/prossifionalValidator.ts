import { z } from 'zod';

export const createProfissionalSchema = z.object({
    body: z.object({
        nome: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
        email: z.email({ message: 'Formato de e-mail inválido.' }),
    }),
});

// Para atualizações, os campos são opcionais, pois o usuário pode querer atualizar apenas um deles.
export const updateProfissionalSchema = z.object({
    body: z.object({
        nome: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }).optional(),
        email: z.email({ message: 'Formato de e-mail inválido.' }).optional(),
    }),
});