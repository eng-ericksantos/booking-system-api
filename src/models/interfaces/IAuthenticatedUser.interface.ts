import { Role } from '@prisma/client';

export interface IAuthenticatedUser {
    id: string;
    role: Role;
}