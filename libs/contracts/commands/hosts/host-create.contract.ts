import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { HostSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace HostCreateContract {
    export const url = REST_API.HOSTS.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.HOSTS.CREATE,
        'post',
        'Create a new host',
    );
    
    export const RequestSchema = HostSchema
        .pick({
            name: true,
            url: true,
            countryCode: true,
            nodeId: true,
            enabled: true,
            priority: true,
            isNew: true,
        })
        .describe('New API token');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}