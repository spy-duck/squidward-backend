import { Injectable, Logger } from '@nestjs/common';

import { safeExecute } from '@/common/helpers/safe-execute';
import { ERRORS } from '@contract/constants';
import { ICommandResponse } from '@/common/types';

import {
    ApiTokenCreateResponseModel,
    ApiTokensListResponseModel,
    ApiTokenRemoveResponseModel,
} from './models';
import { ApiTokenCreateInterface, ApiTokenRemoveInterface } from './interfaces';
import { ApiTokensRepository } from './repositories/api-tokens.repository';
import { ApiTokenEntity } from './entities/api-token.entity';

@Injectable()
export class ApiTokensService {
    private readonly logger = new Logger(ApiTokensService.name);
    private readonly execute = safeExecute(this.logger);
    
    constructor(
        private readonly apiTokensRepository: ApiTokensRepository,
    ) {}
    
    private async validateForApiTokenExists<T>(
        request: ApiTokenCreateInterface,
        makeResponse: (message: string) => T,
        excludeUuid?: string,
    ): Promise<ICommandResponse<T> | null> {
        const exists = await this.apiTokensRepository.findExist(
            request.tokenName,
            excludeUuid,
        );
        
        if (!exists) {
            return null;
        }
        
        const message = (() => {
            switch (true) {
                case exists.tokenName === request.tokenName:
                    return 'API token with same name already exists';
                default:
                    return 'API token already exists';
            }
        })();
        
        return {
            success: false,
            code: ERRORS.API_TOKEN_ALREADY_EXISTS.code,
            response: makeResponse(message),
            message,
        }
    }
    
    async createApiToken(request: ApiTokenCreateInterface): Promise<ICommandResponse<ApiTokenCreateResponseModel>> {
        return this.execute<ApiTokenCreateResponseModel>(
            async () => {
                const existsErrorResponse = await this.validateForApiTokenExists(
                    request,
                    (message) => new ApiTokenCreateResponseModel(false, message),
                );
                
                if (existsErrorResponse) {
                    return existsErrorResponse;
                }
                
                await this.apiTokensRepository.create(
                    new ApiTokenEntity({
                        tokenName: request.tokenName,
                        expireAt: request.expireAt,
                        token: '<token>',
                        createdAt: new Date(),
                    }),
                )
                
                return {
                    success: true,
                    response: new ApiTokenCreateResponseModel(true),
                };
            },
            (errorMessage) => new ApiTokenCreateResponseModel(false, errorMessage),
        );
    }
    
    async apiTokensList(): Promise<ICommandResponse<ApiTokensListResponseModel>> {
        try {
            return {
                success: true,
                response: new ApiTokensListResponseModel(
                    true,
                    null,
                    await this.apiTokensRepository.getAll(),
                ),
            };
        } catch (error) {
            this.logger.error(error);
            let message = '';
            if (error instanceof Error) {
                message = error.message;
            }
            return {
                success: false,
                code: ERRORS.INTERNAL_SERVER_ERROR.code,
                response: new ApiTokensListResponseModel(false, message),
            };
        }
    }
    
    async removeApiToken(request: ApiTokenRemoveInterface): Promise<ICommandResponse<ApiTokenRemoveResponseModel>> {
        try {
            await this.apiTokensRepository.delete(request.uuid);
           
            return {
                success: true,
                response: new ApiTokenCreateResponseModel(true),
            };
        } catch (error) {
            this.logger.error(error);
            let message = '';
            if (error instanceof Error) {
                message = error.message;
            }
            return {
                success: false,
                code: ERRORS.INTERNAL_SERVER_ERROR.code,
                response: new ApiTokenCreateResponseModel(false, message),
            };
        }
    }
}