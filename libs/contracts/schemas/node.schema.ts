import { z } from 'zod';

export const NodeSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    host: z.string(),
    description: z.string(),
    port: z.nullable(z.number().int()),
    createdAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    updatedAt: z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
});