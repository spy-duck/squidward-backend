import { z } from 'zod';

import { USER_STATUS_VALUES } from '../constants/users';


export const UserSchema = z.object({
    uuid: z.uuid(),
    name: z.string().min(3, 'Min. 3 characters'),
    username: z.string().min(5, 'Min. 5 characters'),
    password: z.string().min(16, 'Min. 16 characters'),
    status: z.enum(USER_STATUS_VALUES),
    
    email: z.email().nullable(),
    telegramId: z.number().nullable(),
    usedTrafficBytes: z.number().nullable(),
    
    firstConnectedAt: z
        .date().nullable()
        .or(z
            .iso
            .datetime()
            .nullable()
            .transform((str) => str && new Date(str)),
        ),
    
    expireAt: z
        .date()
        .or(z
            .iso
            .datetime()
            .transform((str) => new Date(str)),
        ),
    
    createdAt: z
        .string()
        .datetime()
        .optional()
        .transform((str) => str && new Date(str)),
    updatedAt: z
        .string()
        .datetime()
        .optional()
        .transform((str) => str && new Date(str)),
});

export type TUser = z.infer<typeof UserSchema>;