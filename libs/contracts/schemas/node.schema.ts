import { z } from 'zod';

import { NODE_STATE_VALUES } from '../constants/nodes/node.state';
import { ConfigSchema } from '../schemas/config.schema';

export const NodeSchema = z.object({
    uuid: z.uuid(),
    name: z.string().nonempty().min(3, 'Min. 3 characters').trim(),
    host: z.url().nonempty().trim()
        .or(z.ipv4().nonempty().trim()),
    port: z.number().int(),
    description: z.string().trim().optional().nullable(),
    configId: z.uuid(),
    config: ConfigSchema.partial().nullable(),
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
    isConnected: z.boolean(),
    state: z.enum(NODE_STATE_VALUES),
    lastConnectedAt: z.iso.datetime().nullable(),
    lastOnlineAt: z.iso.datetime().nullable(),
    
});

export type TNode = z.infer<typeof NodeSchema>;