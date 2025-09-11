import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { REST_API } from '../../api';

export namespace CreateNodeContract {
    export const url = REST_API.NODES.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.CREATE,
        'post',
        'Create a new node',
    );
    
    export const RequestSchema = z.object({
        name: z.string(),
        host: z.string(),
        port: z.string(),
        description: z.string(),
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