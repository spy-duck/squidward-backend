import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema, ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace NodesListContract {
    export const url = REST_API.NODES.LIST;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.LIST,
        'get',
        'Get a list of nodes',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = NodeSchema.pick({
        uuid: true,
        name: true,
        host: true,
        port: true,
        configId: true,
        config: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        isConnected: true,
        state: true,
    }).safeExtend({
        config: ConfigSchema.pick({
            name: true,
        }).nullable(),
    });
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            nodes: z.array(ItemSchema).optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: z.infer<typeof ItemSchema>,
    }
}