import { Injectable, Logger } from '@nestjs/common';

import dayjs from 'dayjs';

import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import {
    ConfigUpdateResponseModel,
    ConfigCreateResponseModel,
    ConfigsListResponseModel,
    ConfigRemoveResponseModel, ConfigGetOneResponseModel,
} from './models';
import {
    ConfigCreateInterface,
    ConfigGetOneInterface,
    ConfigRemoveInterface,
    ConfigUpdateInterface,
} from './interfaces';
import { ConfigsRepository } from './repositories/configs.repository';
import { ConfigEntity } from './entities/config.entity';

@Injectable()
export class ConfigsService {
    private readonly logger = new Logger(ConfigsService.name);
    
    constructor(
        private readonly configsRepository: ConfigsRepository,
    ) {}
    
    async createConfig(request: ConfigCreateInterface): Promise<ICommandResponse<ConfigCreateResponseModel>> {
        try {
            await this.configsRepository.create(
                new ConfigEntity({
                    name: request.name,
                    config: request.config,
                    version: dayjs().format('YYYYMMDDHHmmssSSS')
                }),
            )
            return {
                success: true,
                response: new ConfigCreateResponseModel(true),
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
                response: new ConfigCreateResponseModel(false, message),
            };
        }
    }
    
    async certsList(): Promise<ICommandResponse<ConfigsListResponseModel>> {
        try {
            return {
                success: true,
                response: new ConfigsListResponseModel(
                    true,
                    null,
                    await this.configsRepository.getAll(),
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
                response: new ConfigsListResponseModel(false, message),
            };
        }
    }
    
    async updateCert(request: ConfigUpdateInterface): Promise<ICommandResponse<ConfigUpdateResponseModel>> {
        try {
            await this.configsRepository.update(
                new ConfigEntity({
                    uuid: request.uuid,
                    name: request.name,
                    config: request.config,
                    version: dayjs().format('YYYYMMDDHHmmssSSS'),
                    updatedAt: new Date(),
                })
            )
            return {
                success: true,
                response: new ConfigCreateResponseModel(true),
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
                response: new ConfigCreateResponseModel(false, message),
            };
        }
    }
    
    async removeCert(request: ConfigRemoveInterface): Promise<ICommandResponse<ConfigRemoveResponseModel>> {
        try {
            const config = await this.configsRepository.getByUuid(request.uuid);
            
            if (!config) {
                return {
                    success: false,
                    code: ERRORS.CONFIG_NOT_FOUND.code,
                    response: new ConfigGetOneResponseModel(false, 'Config not found'),
                };
            }
            if (config.nodesCount && config.nodesCount > 0) {
                return {
                    success: false,
                    code: ERRORS.CONFIG_IS_USED_BY_NODES.code,
                    response: new ConfigGetOneResponseModel(false, ERRORS.CONFIG_IS_USED_BY_NODES.message),
                };
            }
            await this.configsRepository.delete(request.uuid);
            return {
                success: true,
                response: new ConfigCreateResponseModel(true),
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
                response: new ConfigCreateResponseModel(false, message),
            };
        }
    }
    
    async getOneConfig(request: ConfigGetOneInterface): Promise<ICommandResponse<ConfigGetOneResponseModel>> {
        try {
            const config = await this.configsRepository.getByUuid(request.uuid);
            
            if (!config) {
                return {
                    success: false,
                    code: ERRORS.CONFIG_NOT_FOUND.code,
                    response: new ConfigGetOneResponseModel(false, 'Config not found'),
                };
            }
            
            return {
                success: true,
                response: new ConfigGetOneResponseModel(true, null, config),
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
                response: new ConfigGetOneResponseModel(false, message),
            };
        }
    }
}