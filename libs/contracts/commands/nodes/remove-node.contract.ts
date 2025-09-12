import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace RemoveNodeContract {
    export const url = REST_API.NODES.REMOVE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.REMOVE(':uuid'),
        'delete',
        'Remove node',
    );
    
    export const RequestSchema = NodeSchema.pick({
        uuid: true,
    });
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}