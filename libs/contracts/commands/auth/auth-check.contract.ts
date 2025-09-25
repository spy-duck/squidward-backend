import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { REST_API } from '../../api';

export namespace AuthCheckContract {
    export const url = REST_API.AUTH.CHECK;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.AUTH.CHECK,
        'get',
        'Check for authentication',
    );
    
    export const ResponseSchema = z.object({
        success: z.boolean(),
        error: z.string().nullable(),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}