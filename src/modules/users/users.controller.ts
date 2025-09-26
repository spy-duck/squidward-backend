import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    UserCreateContract,
    UsersListContract,
    UserUpdateContract,
    UserRemoveContract,
} from '@contract/commands';
import { Endpoint } from '@/common/decorators/endpoint';
import { USERS_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import {
    UsersListResponseDto,
    RemoveUserRequestDto, RemoveUserResponseDto,
    UserUpdateRequestDto, UserUpdateResponseDto, CreateUserRequestDto, CreateUserResponseDto,
} from './dto';
import { UsersService } from './users.service';

@ApiBearerAuth('Authorization')
@ApiTags(USERS_CONTROLLER_INFO.tag)
@Roles(ROLE.ADMIN, ROLE.API)
@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}
    
    @ApiResponse({ type: CreateUserResponseDto, description: 'User created successfully.' })
    @Endpoint({
        command: UserCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: CreateUserRequestDto,
    })
    async createUser(@Body() body: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        const response = await this.usersService.createUser(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: UsersListResponseDto, description: 'Users fetched successfully.' })
    @Endpoint({
        command: UsersListContract,
        httpCode: HttpStatus.OK,
    })
    async usersList(): Promise<UsersListResponseDto> {
        const response = await this.usersService.usersList();
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: UserUpdateResponseDto, description: 'User updated successfully.' })
    @Endpoint({
        command: UserUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: UserUpdateRequestDto,
    })
    async updateUser(@Body() body: UserUpdateRequestDto): Promise<UserUpdateResponseDto> {
        const response = await this.usersService.updateUser(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: RemoveUserResponseDto, description: 'User removed successfully.' })
    @Endpoint({
        command: UserRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeUser(@Param() body: RemoveUserRequestDto): Promise<RemoveUserResponseDto> {
        const response = await this.usersService.removeUser(body);
        return { response: errorHandler(response) };
    }
}