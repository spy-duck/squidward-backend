import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';

import { Cache } from 'cache-manager';
import dayjs from 'dayjs';

import { ERRORS, ROLE } from '@contract/constants';
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
    
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly jwtService: JwtService,
        private readonly apiTokensRepository: ApiTokensRepository,
    ) { }
    
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
        try {
            const existsErrorResponse = await this.validateForApiTokenExists(
                request,
                (message) => new ApiTokenCreateResponseModel(false, message),
            );
            
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
            
            const apiToken = await this.apiTokensRepository.create(
                new ApiTokenEntity({
                    tokenName: request.tokenName,
                    expireAt: dayjs(request.expireAt).endOf('day').toDate(),
                    token: '<token>',
                    createdAt: new Date(),
                }),
            );
            
            const jwtLifetime = dayjs(request.expireAt).endOf('day').diff(dayjs(), 'minutes');
    
            const accessToken = this.jwtService.sign(
                {
                    username: null,
                    uuid: apiToken.uuid,
                    role: ROLE.API,
                },
                {
                    expiresIn: `${ jwtLifetime }m`,
                },
            );
            
            await this.apiTokensRepository.update({
                ...apiToken,
                token: accessToken,
            });
            
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
            
            await this.cacheManager.del(`api:${request.uuid}`);
            
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