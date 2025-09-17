import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace NodeRestartContract {
    export const url = REST_API.NODES.RESTART;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.RESTART(':uuid'),
        'post',
        'Restart Node',
    );
    
    export const RequestSchema = NodeSchema.pick({
        uuid: true,
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