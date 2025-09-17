import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_START, {
    concurrency: 40,
})
export class NodeStartQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeStartQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly configsRepository: ConfigsRepository,
        private readonly usersRepository: UsersRepository,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Starting node with uuid ${ job.data.nodeUuid }`);
        
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        
        const nodeApi = new NodeApi(node.host, node.port);
        
        const isConfigUpdatedSuccessfully = await this.setNodeConfig(nodeApi, node);
        
        if (!isConfigUpdatedSuccessfully) {
            return;
        }
        
        this.logger.log('Config updated successfully');
        
        const isUsersSentSuccessfully = await this.postUsersToNode(nodeApi, node);
        
        
        if (!isUsersSentSuccessfully) {
            return;
        }
        
        this.logger.log('Users sent successfully');
        
        const { response } = await nodeApi.squidStart();
        if (response.success) {
            this.logger.log(`Node ${ node.name } [${ node.uuid }] started successfully`);
        } else {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to start with error: ${ response.error }`,
            );
        }
    }
    
    async setNodeConfig(nodeApi: NodeApi, node: NodeEntity): Promise<boolean> {
        const config = await this.configsRepository.getByUuid(node.configId);
        if (!config) {
            this.logger.error(`Config with uuid ${ node.configId } for node ${node.uuid} not found`);
            return false;
        }
        const { response } = await nodeApi.setSquidConfig(config.config);
        if (!response.success) {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to update config [${config.uuid}] with error: ${ response.error }`,
            );
        }
        return response.success;
    }
    
    async postUsersToNode(nodeApi: NodeApi, node: NodeEntity): Promise<boolean> {
        const users = await this.usersRepository.getAllActive();
        if (!users.length) {
            this.logger.error(`No users found for node ${node.uuid}`);
            return true;
        }
        const { response } = await nodeApi.postUsers(
            users.map(user => ({
                id: user.uuid,
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