import { Body, Controller, HttpStatus } from '@nestjs/common';

import { Endpoint } from '@/common/decorators/endpoint';
import { CreateNodeContract } from '@contract/commands';
import { errorHandler } from '@/common/helpers';

import { CreateNodeRequestDto, CreateNodeResponseDto } from './dto';
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
}