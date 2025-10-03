import dayjs from 'dayjs';
import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UserUpdateContract {
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
        .safeExtend({
            password: z
                .string()
                .min(8, 'Min. 8 characters')
                .nullable()
                .optional(),
            expireAt: z
                .iso
                .datetime()
                .transform((v) => new Date(v))
                .pipe(z.date().min(dayjs().toDate()))
                .describe('User subscription expiration date.'),
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