import { HttpExceptionWithErrorCodeType } from '@/common/exceptions';
import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import { InternalServerErrorException } from '@nestjs/common';

export function errorHandler<T>(response: ICommandResponse<T>): T {
    if (response.success) {
        if (!response.response) {
            throw new InternalServerErrorException('No data returned');
        }
        return response.response;
    }
    
    if (!response.code) {
        throw new InternalServerErrorException('Unknown error');
    }
    
    const errorObject = Object.values(ERRORS).find((error) => error.code === response.code);
    
    if (!errorObject) {
        throw new InternalServerErrorException('Unknown error');
    }
    
    throw new HttpExceptionWithErrorCodeType(
        errorObject.message,
        errorObject.code,
        errorObject.httpCode,
    );
}