import { Injectable, Logger } from '@nestjs/common';

import { NodeStartQueueService } from '@/queues/node-start/node-start.queue.service';
import { safeExecute } from '@/common/helpers/safe-execute';
import { ERRORS, NODE_STATE } from '@contract/constants';
import { ICommandResponse } from '@/common/types';

import {
    UpdateNodeResponseModel,
    CreateNodeResponseModel,
    NodesListResponseModel,
    RemoveNodeResponseModel, StartNodeResponseModel,
} from './models';
import { CreateNodeInterface, RemoveNodeInterface, UpdateNodeInterface } from './interfaces';
import { NodesRepository } from './repositories/nodes.repository';
import { NodeEntity } from './entities/node.entity';

@Injectable()
export class NodesService {
    private readonly logger = new Logger(NodesService.name);
    private readonly execute = safeExecute(this.logger);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeStartQueueService: NodeStartQueueService,
    ) {}
    
    async createNode(request: CreateNodeInterface): Promise<ICommandResponse<CreateNodeResponseModel>> {
        try {
            await this.nodesRepository.create(
                new NodeEntity({
                    name: request.name,
                    host: request.host,
                    port: request.port,
                    configId: request.configId,
                    description: request.description,
                }),
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
                    configId: request.configId,
                    description: request.description,
                    updatedAt: new Date(),
                }),
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
    
    async startNode(request: RemoveNodeInterface): Promise<ICommandResponse<StartNodeResponseModel>> {
        return this.execute<StartNodeResponseModel>(
            async () => {
                const node = await this.nodesRepository.getByUuid(request.uuid);
                if (!node) {
                    return {
                        success: false,
                        code: ERRORS.NODE_NOT_FOUND.code,
                        response: new StartNodeResponseModel(false, ERRORS.NODE_NOT_FOUND.message),
                    };
                }
                // if (node.state === NODE_STATE.RUNNING) {
                //     return {
                //         success: false,
                //         code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                //         response: new StartNodeResponseModel(false, 'Node is already running'),
                //     };
                // }
                // if (node.state === NODE_STATE.STARTING) {
                //     return {
                //         success: false,
                //         code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                //         response: new StartNodeResponseModel(false, 'Node is starting now'),
                //     };
                // }
                // if (node.state === NODE_STATE.RESTARTING) {
                //     return {
                //         success: false,
                //         code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                //         response: new StartNodeResponseModel(false, 'Node is restarting now'),
                //     };
                // }
                await this.nodesRepository.update({
                    ...node,
                    state: NODE_STATE.STARTING,
                });
                await this.nodeStartQueueService.startNode({ nodeUuid: request.uuid });
                return {
                    success: true,
                    response: new StartNodeResponseModel(true),
                };
            },
            (errorMessage) => new StartNodeResponseModel(false, errorMessage),
        );
    }
}