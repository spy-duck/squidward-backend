import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import {
    UpdateNodeResponseModel,
    CreateNodeResponseModel,
    NodesListResponseModel,
    RemoveNodeResponseModel,
} from './models';
import { CreateNodeInterface, RemoveNodeInterface, UpdateNodeInterface } from './interfaces';
import { NodesRepository } from './repositories/nodes.repository';
import { NodeEntity } from './entities/node.entity';

@Injectable()
export class NodesService {
    private readonly logger = new Logger(NodesService.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
    ) {}
    
    async createNode(request: CreateNodeInterface): Promise<ICommandResponse<CreateNodeResponseModel>> {
        try {
            await this.nodesRepository.create(
                new NodeEntity({
                    name: request.name,
                    host: request.host,
                    port: request.port,
                    description: request.description,
                })
            )
            return {
                success: true,
                response: new CreateNodeResponseModel(true),
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
                response: new CreateNodeResponseModel(false, message),
            };
        }
    }
    
    async nodesList(): Promise<ICommandResponse<NodesListResponseModel>> {
        try {
            return {
                success: true,
                response: new NodesListResponseModel(
                    true,
                    null,
                    await this.nodesRepository.getAll(),
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
                response: new NodesListResponseModel(false, message),
            };
        }
    }
    
    async updateNode(request: UpdateNodeInterface): Promise<ICommandResponse<UpdateNodeResponseModel>> {
        try {
            await this.nodesRepository.update(
                new NodeEntity({
                    uuid: request.uuid,
                    name: request.name,
                    host: request.host,
                    port: request.port,
                    description: request.description,
                })
            )
            return {
                success: true,
                response: new CreateNodeResponseModel(true),
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
                response: new CreateNodeResponseModel(false, message),
            };
        }
    }
    
    async removeNode(request: RemoveNodeInterface): Promise<ICommandResponse<RemoveNodeResponseModel>> {
        try {
            await this.nodesRepository.delete(request.uuid);
            return {
                success: true,
                response: new CreateNodeResponseModel(true),
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
                response: new CreateNodeResponseModel(false, message),
            };
        }
    }
}