import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { HostSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace HostRemoveContract {
    export const url = REST_API.HOSTS.REMOVE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.HOSTS.REMOVE(':uuid'),
        'delete',
        'Remove host',
    );
    
    export const RequestSchema = HostSchema
        .pick({
            uuid: true,
        })
        .describe('Remove host by uuid.');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}