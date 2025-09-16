import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ConfigsListContract {
    export const url = REST_API.CONFIGS.LIST;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.CONFIGS.LIST,
        'get',
        'Get a list of configs',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = ConfigSchema.pick({
        uuid: true,
        name: true,
        nodesCount: true,
        version: true,
        createdAt: true,
        updatedAt: true,
    });
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            configs: z.array(ItemSchema).optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: z.infer<typeof ItemSchema>,
    }
}