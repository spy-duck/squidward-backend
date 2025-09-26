import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ApiTokenSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ApiTokenRemoveContract {
    export const url = REST_API.API_TOKENS.REMOVE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.API_TOKENS.REMOVE(':uuid'),
        'delete',
        'Remove API Token',
    );
    
    export const RequestSchema = ApiTokenSchema
        .pick({
            uuid: true,
        })
        .describe('Remove API Token');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}