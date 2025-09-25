import { Body, Controller, HttpStatus, Param, UseGuards } from '@nestjs/common';

import {
    NodeCreateContract, NodeKeygenContract, NodeRestartContract,
    NodesListContract,
    NodeStartContract,
    NodeStopContract,
    NodeUpdateContract,
} from '@contract/commands';
import { NodeRemoveContract } from '@contract/commands/nodes/node-remove.contract';
import { RolesGuard } from '@/common/guards/roles /roles.guard';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';
import { JwtGuard } from '@/common/guards/jwt';

import {
    NodeCreateRequestDto, NodeCreateResponseDto,
    NodesListResponseDto,
    NodeRemoveRequestDto, NodeRemoveResponseDto,
    NodeUpdateRequestDto, NodeUpdateResponseDto,
    NodeStartRequestDto, NodeStartResponseDto,
    NodeStopRequestDto, NodeStopResponseDto,
    NodeRestartRequestDto, NodeRestartResponseDto, NodeKeygenResponseDto,
} from './dto';
import { NodesService } from './nodes.service';

@UseGuards(JwtGuard, RolesGuard)
@Controller()
export class NodesController {
    constructor(
        private readonly nodesService: NodesService,
    ) {}
    
    @Endpoint({
        command: NodeCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: NodeCreateRequestDto,
    })
    async createNode(@Body() body: NodeCreateRequestDto): Promise<NodeCreateResponseDto> {
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
        command: NodeUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: NodeUpdateRequestDto,
    })
    async updateNode(@Body() body: NodeUpdateRequestDto): Promise<NodeUpdateResponseDto> {
        const response = await this.nodesService.updateNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodeRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeNode(@Param() body: NodeRemoveRequestDto): Promise<NodeRemoveResponseDto> {
        const response = await this.nodesService.removeNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodeStartContract,
        httpCode: HttpStatus.OK,
    })
    async startNode(@Param() body: NodeStartRequestDto): Promise<NodeStartResponseDto> {
        const response = await this.nodesService.startNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodeRestartContract,
        httpCode: HttpStatus.OK,
    })
    async restartNode(@Param() body: NodeRestartRequestDto): Promise<NodeRestartResponseDto> {
        const response = await this.nodesService.restartNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodeStopContract,
        httpCode: HttpStatus.OK,
    })
    async stopNode(@Param() body: NodeStopRequestDto): Promise<NodeStopResponseDto> {
        const response = await this.nodesService.stopNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodeKeygenContract,
        httpCode: HttpStatus.OK,
    })
    async keygenNode(): Promise<NodeKeygenResponseDto> {
        const response = await this.nodesService.keygenNode();
        return { response: errorHandler(response) };
    }
}