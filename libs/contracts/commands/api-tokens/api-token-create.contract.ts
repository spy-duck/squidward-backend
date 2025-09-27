import dayjs from 'dayjs';
import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { ApiTokenSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace ApiTokenCreateContract {
    export const url = REST_API.API_TOKENS.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.API_TOKENS.CREATE,
        'post',
        'Create a new API token',
    );
    
    export const RequestSchema = ApiTokenSchema
        .pick({
            tokenName: true,
            expireAt: true,
        })
        .safeExtend({
            expireAt: z
                .iso
                .datetime()
                .transform((v) => new Date(v))
                .pipe(z.date().min(dayjs().add(1, 'day').toDate()))
                .describe('Token expiration date'),
        })
        .describe('Create a new API token');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}