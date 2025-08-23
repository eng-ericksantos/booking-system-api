import { HorarioDisponivel } from '@prisma/client';

export type HorarioDisponivelDTO = Omit<HorarioDisponivel, 'id'>;