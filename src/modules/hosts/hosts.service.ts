import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import {
    HostCreateResponseModel,
    HostsListResponseModel,
    HostRemoveResponseModel, HostUpdateResponseModel,
} from './models';
import { HostCreateInterface, HostRemoveInterface, HostUpdateInterface } from './interfaces';
import { HostsRepository } from './repositories/hosts.repository';
import { HostEntity } from './entities/host.entity';

@Injectable()
export class HostsService {
    private readonly logger = new Logger(HostsService.name);
    
    constructor(
        private readonly hostsRepository: HostsRepository,
    ) { }
    
    private async validateForHostExists<T>(
        request: HostCreateInterface,
        makeResponse: (message: string) => T,
        excludeUuid?: string,
    ): Promise<ICommandResponse<T> | null> {
        const exists = await this.hostsRepository.findExist(
            request.name,
            excludeUuid,
        );
        
        if (!exists) {
            return null;
        }
        
        const message = (() => {
            switch (true) {
                case exists.name === request.name:
                    return 'Host with same name already exists';
                default:
                    return 'Host token already exists';
            }
        })();
        
        return {
            success: false,
            code: ERRORS.HOST_ALREADY_EXISTS.code,
            response: makeResponse(message),
            message,
        }
    }
    
    async createHost(request: HostCreateInterface): Promise<ICommandResponse<HostCreateResponseModel>> {
        try {
            const existsErrorResponse = await this.validateForHostExists(
                request,
                (message) => new HostCreateResponseModel(false, message),
            );
            
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
            
            await this.hostsRepository.create(
                new HostEntity({
                    name: request.name,
                    url: request.url,
                    countryCode: request.countryCode,
                    nodeId: request.nodeId,
                    enabled: request.enabled,
                }),
            );
            
            return {
                success: true,
                response: new HostCreateResponseModel(true),
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
                response: new HostCreateResponseModel(false, message),
            };
        }
    }
    
    async updateHost(request: HostUpdateInterface): Promise<ICommandResponse<HostUpdateResponseModel>> {
        try {
            const host = await this.hostsRepository.getByUuid(request.uuid);
            if (!host) {
                return {
                    success: false,
                    code: ERRORS.HOST_NOT_FOUND.code,
                    response: new HostUpdateResponseModel(false, ERRORS.HOST_NOT_FOUND.message),
                };
            }
            
            const existsErrorResponse = await this.validateForHostExists(
                request,
                (message) => new HostCreateResponseModel(false, message),
                request.uuid,
            );
            
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
            
            await this.hostsRepository.update(
                new HostEntity({
                    uuid: request.uuid,
                    name: request.name,
                    url: request.url,
                    countryCode: request.countryCode,
                    nodeId: request.nodeId,
                    enabled: request.enabled,
                }),
            );
            
            return {
                success: true,
                response: new HostCreateResponseModel(true),
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
                response: new HostCreateResponseModel(false, message),
            };
        }
    }
    
    async hostsList(): Promise<ICommandResponse<HostsListResponseModel>> {
        try {
            return {
                success: true,
                response: new HostsListResponseModel(
                    true,
                    null,
                    await this.hostsRepository.getAll(),
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
                response: new HostsListResponseModel(false, message),
            };
        }
    }
    
    async removeHost(request: HostRemoveInterface): Promise<ICommandResponse<HostRemoveResponseModel>> {
        try {
            const host = await this.hostsRepository.getByUuid(request.uuid);
            if (!host) {
                return {
                    success: false,
                    code: ERRORS.HOST_NOT_FOUND.code,
                    response: new HostUpdateResponseModel(false, ERRORS.HOST_NOT_FOUND.message),
                };
            }
            
            await this.hostsRepository.delete(request.uuid);
   
            return {
                success: true,
                response: new HostCreateResponseModel(true),
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
                response: new HostCreateResponseModel(false, message),
            };
        }
    }
}