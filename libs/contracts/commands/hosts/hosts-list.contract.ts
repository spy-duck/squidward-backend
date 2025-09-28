import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { HostSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace HostsListContract {
    export const url = REST_API.HOSTS.LIST;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.HOSTS.LIST,
        'get',
        'Get a list of hosts',
    );
    
    export const RequestSchema = z.any();
    
    export type Request = z.infer<typeof RequestSchema>;
    
    export const ItemSchema = HostSchema;
    
    export const ResponseSchema = z.object({
        response: z.object({
            success: z.boolean(),
            error: z.string().nullable(),
            hosts: z.array(ItemSchema).optional(),
        }),
    });
    
    export type Response = z.infer<typeof ResponseSchema>;
    
    export type Types = {
        Item: z.infer<typeof ItemSchema>,
    }
}