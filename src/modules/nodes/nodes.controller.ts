import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    NodeCreateContract, NodeKeygenContract, NodeRestartContract,
    NodesListContract,
    NodeStartContract,
    NodeStopContract,
    NodeUpdateContract,
} from '@contract/commands';
import { NodeRemoveContract } from '@contract/commands/nodes/node-remove.contract';
import { Endpoint } from '@/common/decorators/endpoint';
import { NODES_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

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

@ApiBearerAuth('Authorization')
@ApiTags(NODES_CONTROLLER_INFO.tag)
@Roles(ROLE.ADMIN, ROLE.API)
@Controller()
export class NodesController {
    constructor(
        private readonly nodesService: NodesService,
    ) {}
    
    @ApiResponse({ type: NodeCreateResponseDto, description: 'Node created' })
    @Endpoint({
        command: NodeCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: NodeCreateRequestDto,
    })
    async createNode(@Body() body: NodeCreateRequestDto): Promise<NodeCreateResponseDto> {
        const response = await this.nodesService.createNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodesListResponseDto, description: 'Nodes fetched successfully' })
    @Endpoint({
        command: NodesListContract,
        httpCode: HttpStatus.OK,
    })
    async nodesList(): Promise<NodesListResponseDto> {
        const response = await this.nodesService.nodesList();
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeUpdateResponseDto, description: 'Node updated successfully' })
    @Endpoint({
        command: NodeUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: NodeUpdateRequestDto,
    })
    async updateNode(@Body() body: NodeUpdateRequestDto): Promise<NodeUpdateResponseDto> {
        const response = await this.nodesService.updateNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeRemoveResponseDto, description: 'Node removed successfully' })
    @Endpoint({
        command: NodeRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeNode(@Param() body: NodeRemoveRequestDto): Promise<NodeRemoveResponseDto> {
        const response = await this.nodesService.removeNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeStartResponseDto, description: 'Node task for start node created successfully' })
    @Endpoint({
        command: NodeStartContract,
        httpCode: HttpStatus.OK,
    })
    async startNode(@Param() body: NodeStartRequestDto): Promise<NodeStartResponseDto> {
        const response = await this.nodesService.startNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeRestartResponseDto, description: 'Node task for restart node created successfully' })
    @Endpoint({
        command: NodeRestartContract,
        httpCode: HttpStatus.OK,
    })
    async restartNode(@Param() body: NodeRestartRequestDto): Promise<NodeRestartResponseDto> {
        const response = await this.nodesService.restartNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeStopResponseDto, description: 'Node task for stop node created successfully' })
    @Endpoint({
        command: NodeStopContract,
        httpCode: HttpStatus.OK,
    })
    async stopNode(@Param() body: NodeStopRequestDto): Promise<NodeStopResponseDto> {
        const response = await this.nodesService.stopNode(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: NodeKeygenResponseDto, description: 'Node credentials generated successfully' })
    @Endpoint({
        command: NodeKeygenContract,
        httpCode: HttpStatus.OK,
    })
    async keygenNode(): Promise<NodeKeygenResponseDto> {
        const response = await this.nodesService.keygenNode();
        return { response: errorHandler(response) };
    }
}