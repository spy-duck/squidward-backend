import { z } from 'zod';

export const NodeCredentialsSchema = z.object({
    cert: z.string().nonempty(),
    key: z.string().nonempty(),
    rootCA: z.string().nonempty(),
    jwtPublicKey: z.string().nonempty(),
});

export type TNodeCredentials = z.infer<typeof NodeCredentialsSchema>;