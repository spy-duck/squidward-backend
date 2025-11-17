import { Injectable, Logger } from '@nestjs/common';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';

@Injectable()
export class NodesSetupService {
    private readonly logger = new Logger(NodesSetupService.name);
    
    constructor(
        private readonly configsRepository: ConfigsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly nodeApiService: NodeApiService,
    ) {}
    
    async setupNode(node: NodeEntity) {
        const isConfigUpdatedSuccessfully = await this.setNodeConfig(node);
        
        if (!isConfigUpdatedSuccessfully) {
            return false;
        }
        
        this.logger.log('Config updated successfully');
        
        const isUsersSentSuccessfully = await this.postUsersToNode(node);
        
        if (!isUsersSentSuccessfully) {
            return false;
        }
        
        this.logger.log('Users sent successfully');
        
        return true;
    }
    
    private async setNodeConfig(node: NodeEntity): Promise<boolean> {
        const config = await this.configsRepository.getByUuid(node.configId);
        if (!config) {
            this.logger.error(`Config with uuid ${ node.configId } for node ${ node.uuid } not found`);
            return false;
        }
        const { response } = await this.nodeApiService.setSquidConfig(
            node.host,
            node.port,
            config.config,
        );
        if (!response.success) {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to update config [${ config.uuid }] with error: ${ response.error }`,
            );
        }
        return response.success;
    }
    
    private async postUsersToNode(node: NodeEntity): Promise<boolean> {
        const users = await this.usersRepository.getAllActive();
        const { response } = await this.nodeApiService.postUsers(
            node.host,
            node.port,
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