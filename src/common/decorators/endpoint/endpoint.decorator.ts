import {
    applyDecorators,
    Patch,
    Delete,
    Put,
    All,
    Post,
    Get,
    HttpCode,
    Type,
} from '@nestjs/common';

import { EndpointDetails } from '@contract/constants/endpoint-details';



interface ApiEndpointOptions {
    command: { endpointDetails: EndpointDetails };
    httpCode: number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    apiBody?: string | Function | Type<unknown> | [Function] | undefined;
}

export function Endpoint(options: ApiEndpointOptions) {
    const method = options.command.endpointDetails.REQUEST_METHOD.toLowerCase();
    
    
    return applyDecorators(
        resolveRequestMethod(method)(options.command.endpointDetails.CONTROLLER_URL),
        HttpCode(options.httpCode),
    );
}

function resolveRequestMethod(method: string) {
    switch (method) {
        case 'get':
            return Get;
        case 'post':
            return Post;
        case 'put':
            return Put;
        case 'delete':
            return Delete;
        case 'patch':
            return Patch;
        default:
            return All;
    }
}