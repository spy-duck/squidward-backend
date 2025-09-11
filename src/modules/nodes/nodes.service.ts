import { Injectable, Logger } from '@nestjs/common';

import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import { CreateNodeResponseModel } from './models/create-node-response.model';
import { CreateNodeInterface } from './interfaces/create-node.interface';
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
}