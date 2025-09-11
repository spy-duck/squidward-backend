import { z } from 'zod';

export const NodeSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    host: z.string(),
    port: z.number().int(),
    description: z.string().optional().nullable(),
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

export type TNode = z.infer<typeof NodeSchema>;