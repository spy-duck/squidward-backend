import { z } from 'zod';

import { USER_STATUS_VALUES } from '../constants/users';


export const UserSchema = z.object({
    uuid: z.uuid(),
    name: z.string().min(3, 'Min. 3 characters').trim(),
    username: z.string().min(5, 'Min. 5 characters').trim()
        .describe('Username for authentication'),
    password: z.string().min(8, 'Min. 8 characters').trim()
        .describe('Password for authentication'),
    status: z.enum(USER_STATUS_VALUES)
        .describe('User status'),
    email: z.email()
        .nullable()
        .meta({
            title: "Email address",
            description: "User email address",
        }),
    telegramId: z
        .number()
        .nullable()
        .meta({
            title: "Telegram ID",
            description: "User telegram ID",
        }),
    usedTrafficBytes: z.number().nullable(),
    
    firstConnectedAt: z
        .iso
        .datetime()
        .transform((v) => v ? new Date(v) : null)
        .pipe(z.date().nullable())
        .optional()
        .nullable(),
    
    expireAt: z
        .iso
        .datetime()
        .transform((v) => v ? new Date(v) : null)
        .pipe(z.date()),
    
    createdAt: z
        .iso
        .datetime()
        .transform((v) => v ? new Date(v) : null)
        .pipe(z.date())
        .optional(),
    
    updatedAt: z
        .iso
        .datetime()
        .transform((v) => v ? new Date(v) : null)
        .pipe(z.date())
        .optional(),
});

export type TUser = z.infer<typeof UserSchema>;