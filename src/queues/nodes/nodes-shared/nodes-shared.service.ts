import { Injectable, Logger } from '@nestjs/common';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { NodeApi } from '@/common/node-api/node-api';

@Injectable()
export class NodesSharedService {
    private readonly logger = new Logger(NodesSharedService.name);
    
    constructor(
        private readonly configsRepository: ConfigsRepository,
        private readonly usersRepository: UsersRepository,
    ) {}
    
    async setupNode(nodeApi: NodeApi, node: NodeEntity) {
        const isConfigUpdatedSuccessfully = await this.setNodeConfig(nodeApi, node);
        
        if (!isConfigUpdatedSuccessfully) {
            return false;
        }
        
        this.logger.log('Config updated successfully');
        
        const isUsersSentSuccessfully = await this.postUsersToNode(nodeApi, node);
        
        if (!isUsersSentSuccessfully) {
            return false;
        }
        
        this.logger.log('Users sent successfully');
        
        return true;
    }
    
    private async setNodeConfig(nodeApi: NodeApi, node: NodeEntity): Promise<boolean> {
        const config = await this.configsRepository.getByUuid(node.configId);
        if (!config) {
            this.logger.error(`Config with uuid ${ node.configId } for node ${ node.uuid } not found`);
            return false;
        }
        const { response } = await nodeApi.setSquidConfig(config.config);
        if (!response.success) {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to update config [${ config.uuid }] with error: ${ response.error }`,
            );
        }
        return response.success;
    }
    
    private async postUsersToNode(nodeApi: NodeApi, node: NodeEntity): Promise<boolean> {
        const users = await this.usersRepository.getAllActive();
        const { response } = await nodeApi.postUsers(
            users.map(user => ({
                uuid: user.uuid,
                username: user.username,
                password: user.password,
            })),
        );
        if (!response.success) {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] post users failed with error: ${ response.error }`,
            );
        }
        return response.success;
    }
}