import { z } from 'zod';

import { TNodeState } from '../constants/nodes/node.state';

export const NodeSchema = z.object({
    uuid: z.uuid(),
    name: z.string().min(3, 'Min. 3 characters'),
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
    isEnabled: z.boolean(),
    isConnected: z.boolean(),
    state: z.string<TNodeState>(),
    lastConnectedAt: z.iso.datetime().nullable(),
    lastOnlineAt: z.iso.datetime().nullable(),
    
});

export type TNode = z.infer<typeof NodeSchema>;