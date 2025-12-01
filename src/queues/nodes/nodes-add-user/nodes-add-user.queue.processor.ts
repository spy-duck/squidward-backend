import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
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
        private readonly nodeApiService: NodeApiService,
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
            try {
                const { response } = await this.nodeApiService.addUser(node.host, node.port, {
                    uuid: user.uuid,
                    username: user.username,
                    password: user.password,
                    expireAt: user.expireAt,
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