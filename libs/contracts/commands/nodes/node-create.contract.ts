import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace NodeCreateContract {
    export const url = REST_API.NODES.CREATE;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.CREATE,
        'post',
        'Create a new node',
    );
    
    export const RequestSchema = NodeSchema
        .pick({
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