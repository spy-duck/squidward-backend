import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas/node.schema';
import { REST_API } from '../../api';

export namespace NodeUpdateContract {
    export const url = REST_API.NODES.UPDATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.UPDATE(':uuid'),
        'put',
        'Update node',
    );
    
    export const RequestSchema = NodeSchema
        .pick({
            uuid: true,
            name: true,
            host: true,
            port: true,
            configId: true,
            description: true,
            countryCode: true,
            httpPort: true,
            httpsEnabled: true,
            httpsPort: true,
            speedLimitEnabled: true,
            speedLimit: true,
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