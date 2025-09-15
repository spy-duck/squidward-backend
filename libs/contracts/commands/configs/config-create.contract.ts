import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ConfigCreateContract {
    export const url = REST_API.CONFIGS.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.CONFIGS.CREATE,
        'post',
        'Create a new squid config',
    );
    
    export const RequestSchema = ConfigSchema
        .pick({
            name: true,
            config: true,
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