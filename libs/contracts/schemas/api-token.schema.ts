import { z } from 'zod';

export const ApiTokenSchema = z.object({
    uuid: z.uuid()
        .describe('Unique identifier'),
    
    tokenName: z.string().trim().min(3, 'Min. 3 characters')
        .default('Api token name'),
    
    token: z.string().trim().nonempty()
        .default('JWT Api token'),
    
    expireAt: z
        .iso
        .datetime()
        .transform((v) => new Date(v))
        .pipe(z.date())
        .describe('Token expiration date'),
    
    createdAt: z
        .iso
        .datetime()
        .transform((v) => new Date(v))
        .pipe(z.date())
        .optional()
        .describe('Token creation date'),
})
    .describe('Api token');

export type TApiToken = z.infer<typeof ApiTokenSchema>;