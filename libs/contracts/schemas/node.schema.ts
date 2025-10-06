import { z } from 'zod';

import { NODE_STATE_VALUES } from '../constants/nodes/node.state';
import { ConfigSchema } from '../schemas/config.schema';

export const NodeSchema = z.object({
    uuid: z.uuid(),
    name: z.string().trim().nonempty().min(3, 'Min. 3 characters'),
    host: z.string().trim().nonempty().regex(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/)
        .or(z.ipv4().trim().nonempty()),
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
    isConnected: z.boolean().describe('Is node connected now'),
    isStarted: z.boolean().describe('Is node was started'),
    countryCode: z.string().length(2).describe('Node countryCode'),
    state: z.enum(NODE_STATE_VALUES).describe('State of node'),
    lastConnectedAt: z.iso.datetime().nullable().describe('Last connected at'),
    lastOnlineAt: z.iso.datetime().nullable(),
});

export type TNode = z.infer<typeof NodeSchema>;