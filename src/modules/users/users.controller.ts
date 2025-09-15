import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    CreateUserContract,
    UsersListContract,
    UpdateUserContract,
    RemoveUserContract,
} from '@contract/commands';
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
        command: CreateUserContract,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateUserRequestDto,
    })
    async createNode(@Body() body: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        const response = await this.usersService.createUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: UsersListContract,
        httpCode: HttpStatus.OK,
    })
    async nodesList(): Promise<UsersListResponseDto> {
        const response = await this.usersService.usersList();
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: UpdateUserContract,
        httpCode: HttpStatus.OK,
        apiBody: UpdateNodeRequestDto,
    })
    async updateUser(@Body() body: UpdateNodeRequestDto): Promise<UpdateNodeResponseDto> {
        const response = await this.usersService.updateUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: RemoveUserContract,
        httpCode: HttpStatus.OK,
    })
    async removeUser(@Param() body: RemoveNodeRequestDto): Promise<RemoveNodeResponseDto> {
        const response = await this.usersService.removeUser(body);
        return { response: errorHandler(response) };
    }
}