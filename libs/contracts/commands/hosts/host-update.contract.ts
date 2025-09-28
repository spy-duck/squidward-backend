import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { HostSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace HostUpdateContract {
    export const url = REST_API.HOSTS.UPDATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.HOSTS.UPDATE(':uuid'),
        'put',
        'Update host',
    );
    
    export const RequestSchema = HostSchema
        .pick({
            uuid: true,
            name: true,
            url: true,
            countryCode: true,
            nodeId: true,
            enabled: true,
        })
        .describe('Updated host.');
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
}