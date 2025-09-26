import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { REST_API } from '../../api';

export namespace AuthLoginContract {
    export const url = REST_API.AUTH.LOGIN;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.AUTH.LOGIN,
        'post',
        'Admin login',
    );
    
    export const RequestSchema = z.object({
        login: z.string().nonempty(),
        password: z.string().nonempty(),
    });
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        success: z.boolean(),
        accessToken: z.string().nullable(),
        error: z.string().nullable(),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}