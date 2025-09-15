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
            uuid: true,
            name: true,
            username: true,
            status: true,
            email: true,
            telegramId: true,
            expireAt: true,
        })
        .extend({
            password: z
                .string()
                .min(16, 'Min. 16 characters')
                .nullable()
                .optional(),
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