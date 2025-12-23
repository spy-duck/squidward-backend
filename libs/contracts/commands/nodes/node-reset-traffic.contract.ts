import { z } from 'zod';

import { getEndpointDetails } from '../../constants/endpoint-details';
import { NodeSchema } from '../../schemas';
import { REST_API } from '../../api';

export namespace NodeResetTrafficContract {
    export const url = REST_API.NODES.RESET_TRAFFIC;
    
    export const endpointDetails = getEndpointDetails(
        REST_API.NODES.RESET_TRAFFIC(':uuid'),
        'delete',
        'Reset node traffic',
    );
    
    export const ParamsSchema = NodeSchema.pick({
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