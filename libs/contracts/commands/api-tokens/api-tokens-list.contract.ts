import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ApiTokenSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ApiTokensListContract {
    export const url = REST_API.API_TOKENS.LIST;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.API_TOKENS.LIST,
        'get',
        'Get a list of API tokens',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = ApiTokenSchema.pick({
        uuid: true,
        tokenName: true,
        token: true,
        expireAt: true,
        createdAt: true,
    });
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            apiTokens: z.array(ItemSchema).optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: z.infer<typeof ItemSchema>,
    }
}