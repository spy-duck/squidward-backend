import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import { CreateNodeContract, NodesListContract, UpdateNodeContract } from '@contract/commands';
import { RemoveNodeContract } from '@contract/commands/nodes/remove-node.contract';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';

import {
    CreateNodeRequestDto, CreateNodeResponseDto,
    NodesListResponseDto, RemoveNodeRequestDto, RemoveNodeResponseDto,
    UpdateNodeRequestDto, UpdateNodeResponseDto,
} from './dto';
import { NodesService } from './nodes.service';

@Controller()
export class NodesController {
    constructor(
        private readonly nodesService: NodesService,
    ) {}
    
    @Endpoint({
        command: CreateNodeContract,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateNodeRequestDto,
    })
    async createNode(@Body() body: CreateNodeRequestDto): Promise<CreateNodeResponseDto> {
        const response = await this.nodesService.createNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodesListContract,
        httpCode: HttpStatus.OK,
    })
    async nodesList(): Promise<NodesListResponseDto> {
        const response = await this.nodesService.nodesList();
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: UpdateNodeContract,
        httpCode: HttpStatus.OK,
        apiBody: UpdateNodeRequestDto,
    })
    async updateNode(@Body() body: UpdateNodeRequestDto): Promise<UpdateNodeResponseDto> {
        const response = await this.nodesService.updateNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: RemoveNodeContract,
        httpCode: HttpStatus.OK,
    })
    async removeNode(@Param() body: RemoveNodeRequestDto): Promise<RemoveNodeResponseDto> {
        const response = await this.nodesService.removeNode(body);
        return { response: errorHandler(response) };
    }
}