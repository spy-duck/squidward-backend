import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { REST_API } from '../../api';

export namespace NodeKeygenContract {
    export const url = REST_API.NODES.KEYGEN;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.KEYGEN,
        'get',
        'Get node credentials',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = null;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            credentials: z.string().nonempty(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: null,
    }
}