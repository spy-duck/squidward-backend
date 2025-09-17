import { Injectable, Logger } from '@nestjs/common';

import { NodeRestartQueueService, NodeStartQueueService, NodeStopQueueService } from '@/queues';
import { ERRORS, NODE_STATE, TNodeState } from '@contract/constants';
import { safeExecute } from '@/common/helpers/safe-execute';
import { ICommandResponse } from '@/common/types';

import {
    UpdateNodeResponseModel,
    CreateNodeResponseModel,
    NodesListResponseModel,
    RemoveNodeResponseModel, StartNodeResponseModel, StopNodeResponseModel, RestartNodeResponseModel,
} from './models';
import {
    CreateNodeInterface,
    RemoveNodeInterface, RestartNodeInterface,
    StartNodeInterface,
    StopNodeInterface,
    UpdateNodeInterface,
} from './interfaces';
import { NodesRepository } from './repositories/nodes.repository';
import { NodeEntity } from './entities/node.entity';

@Injectable()
export class NodesService {
    private readonly logger = new Logger(NodesService.name);
    private readonly execute = safeExecute(this.logger);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeStartQueueService: NodeStartQueueService,
        private readonly nodeRestartQueueService: NodeRestartQueueService,
        private readonly nodeStopQueueService: NodeStopQueueService,
    ) {}
    
    private async validateForNodeExists<T>(
        request: CreateNodeInterface | UpdateNodeInterface,
        makeResponse: (message: string) => T,
        excludeUuid?: string,
    ): Promise<ICommandResponse<T> | null> {
        const exists = await this.nodesRepository.findExist(
            request.name,
            request.host,
            excludeUuid,
        );
        
        if (!exists) {
            return null;
        }
        
        const message = (() => {
            switch (true) {
                case exists.name === request.name:
                    return 'Node with same name already exists';
                case exists.host === request.host:
                    return 'Node with same host already exists';
                default:
                    return 'Node already exists';
            }
        })();
        
        return {
            success: false,
            code: ERRORS.USER_ALREADY_EXISTS.code,
            response: makeResponse(message),
            message,
        }
    }
    
    async createNode(request: CreateNodeInterface): Promise<ICommandResponse<CreateNodeResponseModel>> {
        try {
            const existsErrorResponse = await this.validateForNodeExists(
                request,
                (message) => new CreateNodeResponseModel(false, message),
            );
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
            
            await this.nodesRepository.create(
                new NodeEntity({
                    name: request.name,
                    host: request.host,
                    port: request.port,
                    configId: request.configId,
                    description: request.description,
                    state: NODE_STATE.CREATED,
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
            const node = await this.nodesRepository.getByUuid(request.uuid);
            if (!node) {
                return {
                    success: false,
                    code: ERRORS.NODE_NOT_FOUND.code,
                    response: new UpdateNodeResponseModel(false, ERRORS.NODE_NOT_FOUND.message),
                };
            }
            const existsErrorResponse = await this.validateForNodeExists(
                request,
                (message) => new UpdateNodeResponseModel(false, message),
                request.uuid,
            );
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
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
                response: new UpdateNodeResponseModel(true),
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
            const node = await this.nodesRepository.getByUuid(request.uuid);
            if (!node) {
                return {
                    success: false,
                    code: ERRORS.NODE_NOT_FOUND.code,
                    response: new RemoveNodeResponseModel(false, ERRORS.NODE_NOT_FOUND.message),
                };
            }
            await this.nodesRepository.delete(request.uuid);
            return {
                success: true,
                response: new RemoveNodeResponseModel(true),
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
                response: new RemoveNodeResponseModel(false, message),
            };
        }
    }
    
    async startNode(request: StartNodeInterface): Promise<ICommandResponse<StartNodeResponseModel>> {
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
                
                if (!this.validateNodeStateForAction(node, [
                    NODE_STATE.STOPPED,
                    NODE_STATE.FATAL,
                    NODE_STATE.SHUTDOWN,
                ])) {
                    return {
                        success: false,
                        code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                        response: new StartNodeResponseModel(false, 'Node is already running'),
                    };
                }
                
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
    
    async restartNode(request: RestartNodeInterface): Promise<ICommandResponse<RestartNodeResponseModel>> {
        return this.execute<StartNodeResponseModel>(
            async () => {
                const node = await this.nodesRepository.getByUuid(request.uuid);
                if (!node) {
                    return {
                        success: false,
                        code: ERRORS.NODE_NOT_FOUND.code,
                        response: new RestartNodeResponseModel(false, ERRORS.NODE_NOT_FOUND.message),
                    };
                }
                
                if (!this.validateNodeStateForAction(node, [
                    NODE_STATE.RUNNING,
                ])) {
                    return {
                        success: false,
                        code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                        response: new RestartNodeResponseModel(false, 'Node is already running'),
                    };
                }
                
                await this.nodesRepository.update({
                    ...node,
                    state: NODE_STATE.RESTARTING,
                });
                
                await this.nodeRestartQueueService.restartNode({ nodeUuid: request.uuid });
                
                return {
                    success: true,
                    response: new RestartNodeResponseModel(true),
                };
            },
            (errorMessage) => new RestartNodeResponseModel(false, errorMessage),
        );
    }
    
    async stopNode(request: StopNodeInterface): Promise<ICommandResponse<StopNodeResponseModel>> {
        return this.execute<StartNodeResponseModel>(
            async () => {
                const node = await this.nodesRepository.getByUuid(request.uuid);
                if (!node) {
                    return {
                        success: false,
                        code: ERRORS.NODE_NOT_FOUND.code,
                        response: new StopNodeResponseModel(false, ERRORS.NODE_NOT_FOUND.message),
                    };
                }
                
                if (!this.validateNodeStateForAction(node, [
                    NODE_STATE.RUNNING,
                ])) {
                    return {
                        success: false,
                        code: ERRORS.NODE_INVALID_STATUS_FOR_START.code,
                        response: new StopNodeResponseModel(false, 'Node is already running'),
                    };
                }
                
                await this.nodesRepository.update({
                    ...node,
                    state: NODE_STATE.STOPPING,
                });
                
                await this.nodeStopQueueService.stopNode({ nodeUuid: request.uuid });
                
                return {
                    success: true,
                    response: new StopNodeResponseModel(true),
                };
            },
            (errorMessage) => new StopNodeResponseModel(false, errorMessage),
        );
    }
    
    private validateNodeStateForAction(node: NodeEntity, availableStates: TNodeState[]): boolean {
        return availableStates.includes(node.state);
    }
}