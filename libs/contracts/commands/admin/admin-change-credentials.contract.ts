import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { passwordSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace AdminChangeCredentialsContract {
    export const url = REST_API.ADMIN.CHANGE_CREDENTIALS;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.ADMIN.CHANGE_CREDENTIALS,
        'post',
        'Change admin credentials',
    );
    
    export const RequestSchema = z.object({
        username: z.string()
            .trim()
            .min(5)
            .max(30)
            .regex(/^[a-zA-Z0-9\-_]+$/, "Allowed characters are a-z, A-Z, 0-9, - and _"),
        password: passwordSchema,
        rePassword: z.string().trim().nonempty(),
    }).superRefine(({ rePassword, password }, ctx) => {
        if (rePassword !== password) {
            ctx.addIssue('The passwords did not match');
        }
    });
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        success: z.boolean(),
        error: z.string().nullable(),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}