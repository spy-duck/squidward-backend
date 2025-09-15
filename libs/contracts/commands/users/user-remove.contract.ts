import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UserRemoveContract {
    export const url = REST_API.USERS.REMOVE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.USERS.REMOVE(':uuid'),
        'delete',
        'Remove user',
    );
    
    export const RequestSchema = UserSchema
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