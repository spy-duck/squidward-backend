import dayjs from 'dayjs';
import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UserCreateContract {
    export const url = REST_API.USERS.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.USERS.CREATE,
        'post',
        'Create a new user',
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
        })
        .safeExtend({
            expireAt: z
                .iso
                .datetime()
                .transform((v) => new Date(v))
                .pipe(z.date().min(dayjs().toDate()))
                .describe('User subscription expiration date'),
        })
        .describe('Create a new user');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}