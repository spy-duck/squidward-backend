import { Injectable, Logger } from '@nestjs/common';

import { some } from 'lodash-es';

import { NodesUpdateUserQueueService, NodesRemoveUserQueueService, NodesAddUserQueueService } from '@/queues';
import { safeExecute } from '@/common/helpers/safe-execute';
import { ERRORS, USER_STATUS } from '@contract/constants';
import { encryptPassword } from '@/common/helpers';
import { ICommandResponse } from '@/common/types';

import {
    UpdateUserResponseModel,
    CreateUserResponseModel,
    UsersListResponseModel,
    RemoveUserResponseModel, ResetUserTrafficResponseModel,
} from './models';
import { CreateUserInterface, RemoveUserInterface, ResetUserTrafficInterface, UpdateUserInterface } from './interfaces';
import { UsersRepository, UsersMetricsRepository } from './repositories';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    private readonly execute = safeExecute(this.logger);
    
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly nodesAddUserQueueService: NodesAddUserQueueService,
        private readonly nodesRemoveUserQueueService: NodesRemoveUserQueueService,
        private readonly nodesUpdateUserQueueService: NodesUpdateUserQueueService,
        private readonly usersMetricsRepository: UsersMetricsRepository,
    ) {}
    
    private async validateForUserExists<T>(
        request: CreateUserInterface | UpdateUserInterface,
        makeResponse: (message: string) => T,
        excludeUuid?: string,
    ): Promise<ICommandResponse<T> | null> {
        const exists = await this.usersRepository.findExist(
            request.name,
            request.username,
            request.email,
            request.telegramId,
            excludeUuid,
        );
        
        if (!exists) {
            return null;
        }
        
        const message = (() => {
            switch (true) {
                case exists.name === request.name:
                    return 'User with same name already exists';
                case exists.username === request.username:
                    return 'User with same username already exists';
                case exists.email === request.email:
                    return 'User with same email already exists';
                case exists.telegramId === request.telegramId:
                    return 'User with same telegram id already exists';
                default:
                    return 'User already exists';
            }
        })();
        
        return {
            success: false,
            code: ERRORS.USER_ALREADY_EXISTS.code,
            response: makeResponse(message),
            message,
        }
    }
    
    async createUser(request: CreateUserInterface): Promise<ICommandResponse<CreateUserResponseModel>> {
        return this.execute<CreateUserResponseModel>(
            async () => {
                const existsErrorResponse = await this.validateForUserExists(
                    request,
                    (message) => new CreateUserResponseModel(false, message),
                );
                
                if (existsErrorResponse) {
                    return existsErrorResponse;
                }
                
                const createdUser = await this.usersRepository.create(
                    new UserEntity({
                        name: request.name,
                        username: request.username,
                        password: await encryptPassword(request.password),
                        status: request.status,
                        email: request.email,
                        telegramId: request.telegramId,
                        expireAt: request.expireAt,
                    }),
                )
                
                await this.nodesAddUserQueueService.addUser({
                    userUuid: createdUser.uuid,
                });
                
                return {
                    success: true,
                    response: new CreateUserResponseModel(true),
                };
            },
            (errorMessage) => new CreateUserResponseModel(false, errorMessage),
        );
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
            const existsErrorResponse = await this.validateForUserExists(
                request,
                (message) => new UpdateUserResponseModel(false, message),
                request.uuid,
            );
            
            if (existsErrorResponse) {
                return existsErrorResponse;
            }
            
            const user = await this.usersRepository.getByUuid(request.uuid);
            
            if (!user) {
                return {
                    success: false,
                    code: ERRORS.USER_NOT_FOUND.code,
                    response: new UpdateUserResponseModel(false, 'User not found'),
                };
            }

            const status = (() => {
                switch (true) {
                    case request.expireAt && user.status === USER_STATUS.EXPIRED && request.status === USER_STATUS.EXPIRED:
                        return USER_STATUS.ACTIVE;
                    default:
                        return request.status;
                }
            })();
            
            await this.usersRepository.update(
                new UserEntity({
                    uuid: request.uuid,
                    name: request.name,
                    username: request.username,
                    status,
                    email: request.email,
                    telegramId: request.telegramId,
                    updatedAt: new Date(),
                    ...request.password && {
                        password: await encryptPassword(request.password),
                    },
                    ...request.expireAt && {
                        expireAt: request.expireAt,
                    },
                }),
            );
            
            if (user.status === USER_STATUS.ACTIVE && status !== USER_STATUS.ACTIVE) {
                await this.nodesRemoveUserQueueService.removeUser({
                    userUuid: request.uuid,
                });
            }
            
            if (user.status !== USER_STATUS.ACTIVE && status === USER_STATUS.ACTIVE) {
                await this.nodesAddUserQueueService.addUser({
                    userUuid: user.uuid,
                });
            }
            
            
            if (some([
                user.username !== request.username,
                request.password,
            ])) {
                await this.nodesUpdateUserQueueService.updateUser({
                    userUuid: request.uuid,
                });
            }
            
            return {
                success: true,
                response: new UpdateUserResponseModel(true),
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
                response: new UpdateUserResponseModel(false, message),
            };
        }
    }
    
    async removeUser(request: RemoveUserInterface): Promise<ICommandResponse<RemoveUserResponseModel>> {
        try {
            await this.usersRepository.delete(request.uuid);
            await this.nodesRemoveUserQueueService.removeUser({
                userUuid: request.uuid,
            });
            
            return {
                success: true,
                response: new RemoveUserResponseModel(true),
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
                response: new RemoveUserResponseModel(false, message),
            };
        }
    }
    
    async resetUserTraffic(request: ResetUserTrafficInterface): Promise<ICommandResponse<ResetUserTrafficResponseModel>> {
        try {
            await this.usersMetricsRepository.resetUserMetrics(request.uuid);

            return {
                success: true,
                response: new ResetUserTrafficResponseModel(true),
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
                response: new ResetUserTrafficResponseModel(false, message),
            };
        }
    }
}