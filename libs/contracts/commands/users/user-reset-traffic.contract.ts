import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { UserSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace UserResetTrafficContract {
    export const url = REST_API.USERS.RESET_TRAFFIC;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.USERS.RESET_TRAFFIC(':uuid'),
        'delete',
        'Reset user traffic',
    );
    
    export const ParamsSchema = UserSchema
        .pick({
            uuid: true,
        });
    
    export type Params = z.infer<typeof ParamsSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}