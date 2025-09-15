import { Injectable, Logger } from '@nestjs/common';

import { encryptPassword } from '@/common/helpers';
import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import {
    UpdateUserResponseModel,
    CreateUserResponseModel,
    UsersListResponseModel,
    RemoveUserResponseModel,
} from './models';
import { CreateUserInterface, RemoveUserInterface, UpdateUserInterface } from './interfaces';
import { UsersRepository } from './repositories/users.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}
    
    async createUser(request: CreateUserInterface): Promise<ICommandResponse<CreateUserResponseModel>> {
        try {
            await this.usersRepository.create(
                new UserEntity({
                    name: request.name,
                    username: request.username,
                    password: await encryptPassword(request.password),
                    status: request.status,
                    email: request.email,
                    telegramId: request.telegramId,
                    expireAt: request.expireAt,
                })
            )
            return {
                success: true,
                response: new CreateUserResponseModel(true),
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
                response: new CreateUserResponseModel(false, message),
            };
        }
    }
    
    async usersList(): Promise<ICommandResponse<UsersListResponseModel>> {
        try {
            return {
                success: true,
                response: new UsersListResponseModel(
                    true,
                    null,
                    await this.usersRepository.getAll(),
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
                response: new UsersListResponseModel(false, message),
            };
        }
    }
    
    async updateUser(request: UpdateUserInterface): Promise<ICommandResponse<UpdateUserResponseModel>> {
        try {
            await this.usersRepository.update(
                new UserEntity({
                    uuid: request.uuid,
                    name: request.name,
                    username: request.username,
                    ...request.password && {
                        password: await encryptPassword(request.password),
                    },
                    status: request.status,
                    email: request.email,
                    telegramId: request.telegramId,
                    expireAt: request.expireAt,
                    updatedAt: new Date(),
                })
            )
            return {
                success: true,
                response: new CreateUserResponseModel(true),
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
                response: new CreateUserResponseModel(false, message),
            };
        }
    }
    
    async removeUser(request: RemoveUserInterface): Promise<ICommandResponse<RemoveUserResponseModel>> {
        try {
            await this.usersRepository.delete(request.uuid);
            return {
                success: true,
                response: new CreateUserResponseModel(true),
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
                response: new CreateUserResponseModel(false, message),
            };
        }
    }
}