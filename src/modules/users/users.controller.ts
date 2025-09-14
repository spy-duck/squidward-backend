import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import { CreateNodeContract, NodesListContract, UpdateNodeContract } from '@contract/commands';
import { RemoveNodeContract } from '@contract/commands/nodes/remove-node.contract';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';

import {
    UsersListResponseDto,
    RemoveNodeRequestDto, RemoveNodeResponseDto,
    UpdateNodeRequestDto, UpdateNodeResponseDto, CreateUserRequestDto, CreateUserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}
    
    @Endpoint({
        command: CreateNodeContract,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateUserRequestDto,
    })
    async createNode(@Body() body: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        const response = await this.usersService.createUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: NodesListContract,
        httpCode: HttpStatus.OK,
    })
    async nodesList(): Promise<UsersListResponseDto> {
        const response = await this.usersService.usersList();
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: UpdateNodeContract,
        httpCode: HttpStatus.OK,
        apiBody: UpdateNodeRequestDto,
    })
    async updateNode(@Body() body: UpdateNodeRequestDto): Promise<UpdateNodeResponseDto> {
        const response = await this.usersService.updateNode(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: RemoveNodeContract,
        httpCode: HttpStatus.OK,
    })
    async removeNode(@Param() body: RemoveNodeRequestDto): Promise<RemoveNodeResponseDto> {
        const response = await this.usersService.removeNode(body);
        return { response: errorHandler(response) };
    }
}