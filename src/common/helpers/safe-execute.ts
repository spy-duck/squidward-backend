import { Logger } from '@nestjs/common';

import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

export const safeExecute = (logger: Logger) =>
    async <T>(
        fn: () => Promise<ICommandResponse<T>>,
        err: (errorMessage: string) => T,
    ): Promise<ICommandResponse<T>> => {
        try {
            return fn();
        } catch (error) {
            logger.error(error);
            let errorMessage = '';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return {
                success: false,
                code: ERRORS.INTERNAL_SERVER_ERROR.code,
                response: err(errorMessage),
            };
        }
    };