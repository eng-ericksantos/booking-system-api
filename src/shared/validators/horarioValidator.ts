import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Valida o formato HH:mm

export const createHorarioSchema = z.object({
    body: z.object({
        diaDaSemana: z.number().int().min(0, 'Dia da semana deve ser entre 0 e 6.')
            .max(6, 'Dia da semana deve ser entre 0 e 6.'),
        horaInicio: z.string().regex(timeRegex, 'Formato de hora inválido. Use HH:mm.'),
        horaFim: z.string().regex(timeRegex, 'Formato de hora inválido. Use HH:mm.'),
    }).refine((data) => data.horaInicio < data.horaFim, {
        message: 'A hora de início deve ser anterior à hora de fim.',
        path: ['horaFim'], // Indica qual campo está relacionado ao erro
    }),

    params: z.object({
        profissionalId: z.uuid({ message: 'ID de profissional inválido.' }),
    }),
});

// Validador para quando precisarmos do ID do horário (ex: para deletar)
export const horarioIdSchema = z.object({
    params: z.object({
        id: z.uuid({ message: 'ID de horário inválido.' }),
        profissionalId: z.uuid({ message: 'ID de profissional inválido.' }),
    })
});