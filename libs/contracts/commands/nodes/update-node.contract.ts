import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas/node.schema';
import { REST_API } from '../../api';

export namespace UpdateNodeContract {
    export const url = REST_API.NODES.UPDATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.UPDATE,
        'put',
        'Update node',
    );
    
    export const RequestSchema = NodeSchema;
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}