import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ConfigGetOneContract {
    export const url = REST_API.CONFIGS.GET_ONE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.CONFIGS.GET_ONE(':uuid'),
        'get',
        'Get config item',
    );
    
    export const RequestSchema = ConfigSchema
        .pick({
            uuid: true,
        });
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            config: ConfigSchema.optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}