import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    UserCreateContract,
    UsersListContract,
    UserUpdateContract,
    UserRemoveContract,
} from '@contract/commands';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';

import {
    UsersListResponseDto,
    RemoveNodeRequestDto, RemoveNodeResponseDto,
    UserUpdateRequestDto, UserUpdateResponseDto, CreateUserRequestDto, CreateUserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}
    
    @Endpoint({
        command: UserCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateUserRequestDto,
    })
    async createUser(@Body() body: CreateUserRequestDto): Promise<CreateUserResponseDto> {
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
        command: UserUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: UserUpdateRequestDto,
    })
    async updateUser(@Body() body: UserUpdateRequestDto): Promise<UserUpdateResponseDto> {
        const response = await this.usersService.updateUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: UserRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeUser(@Param() body: RemoveNodeRequestDto): Promise<RemoveNodeResponseDto> {
        const response = await this.usersService.removeUser(body);
        return { response: errorHandler(response) };
    }
}