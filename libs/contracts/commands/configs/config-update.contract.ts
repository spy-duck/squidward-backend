import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ConfigUpdateContract {
    export const url = REST_API.CONFIGS.UPDATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.CONFIGS.UPDATE(':uuid'),
        'put',
        'Update cofig',
    );
    
    export const RequestSchema = ConfigSchema
        .pick({
            uuid: true,
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