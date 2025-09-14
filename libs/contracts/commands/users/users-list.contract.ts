import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UsersListContract {
    export const url = REST_API.USERS.LIST;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.USERS.LIST,
        'get',
        'Get a list of users',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = UserSchema.pick({
        uuid: true,
        name: true,
        username: true,
        status: true,
        email: true,
        telegramId: true,
        usedTrafficBytes: true,
        firstConnectedAt: true,
        expireAt: true,
        description: true,
        createdAt: true,
        updatedAt: true,
    });
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            users: z.array(ItemSchema).optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: z.infer<typeof ItemSchema>,
    }
}