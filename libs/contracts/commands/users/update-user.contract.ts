import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UpdateUserContract {
    export const url = REST_API.USERS.UPDATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.USERS.UPDATE(':uuid'),
        'put',
        'Update user',
    );
    
    export const RequestSchema = UserSchema
        .pick({
            name: true,
            username: true,
            password: true,
            status: true,
            email: true,
            telegramId: true,
            expireAt: true,
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