import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserInterface } from './interfaces';

@Processor(QUEUES.NODES_ADD_USER, {
    concurrency: 40,
})
export class NodesAddUserQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodesAddUserQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly usersRepository: UsersRepository,
    ) {
        super();
    }
    
    async process(job: Job<NodeAddUserInterface>) {
        this.logger.log(`Starting add user ${ job.data.userUuid } to nodes`);
        
        
        const user = await this.usersRepository.getByUuid(job.data.userUuid);
        if (!user) {
            this.logger.error(`User ${ job.data.userUuid } not found`);
            return;
        }
        
        const nodes = await this.nodesRepository.getAllActive();
       
        for (const node of nodes) {
            const nodeApi = new NodeApi(node.host, node.port);
            try {
                const { response } = await nodeApi.addUser({
                    uuid: user.uuid,
                    username: user.username,
                    password: user.password,
                });
                
                if (response.success) {
                    this.logger.log(`User [${ node.uuid }] added to node [${ node.uuid }] successfully`);
                } else {
                    this.logger.error(
                        `Failed to add user [${ node.uuid }] to node [${ node.uuid }] with error: ${ response.error }`,
                    );
                }
            } catch (error) {
                this.logger.error(
                    `Fatal error while adding user [${ node.uuid }] to node [${ node.uuid }]: ${ error }`,
                );
            }
        }
    }
}