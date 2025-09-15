import { z } from 'zod';

export const ConfigSchema = z.object({
    uuid: z.uuid(),
    name: z.string().min(3, 'Min. 3 characters'),
    config: z.string().nonempty(),
    version: z.string(),
    createdAt: z
        .date().optional()
        .or(z
            .iso
            .datetime()
            .optional()
            .transform((str) => str ? new Date(str) : null),
        ),
    updatedAt: z
        .date().optional()
        .or(z
            .iso
            .datetime()
            .optional()
            .transform((str) => str ? new Date(str) : null),
        ),
});

export type TConfig = z.infer<typeof ConfigSchema>;