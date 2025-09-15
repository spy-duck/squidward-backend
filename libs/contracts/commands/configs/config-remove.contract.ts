import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ConfigSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ConfigRemoveContract {
    export const url = REST_API.CONFIGS.REMOVE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.CONFIGS.REMOVE(':uuid'),
        'delete',
        'Remove config',
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
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}