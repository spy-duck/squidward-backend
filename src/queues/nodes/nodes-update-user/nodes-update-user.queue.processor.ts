import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeUpdateUserInterface } from './interfaces';

@Processor(QUEUES.NODES_UPDATE_USER, {
    concurrency: 40,
})
export class NodesUpdateUserQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodesUpdateUserQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly nodeApiService: NodeApiService,
    ) {
        super();
    }
    
    async process(job: Job<NodeUpdateUserInterface>) {
        this.logger.log(`Starting update user ${ job.data.userUuid } on nodes`);
        
        
        const user = await this.usersRepository.getByUuid(job.data.userUuid);
        
        if (!user) {
            this.logger.error(`User ${ job.data.userUuid } not found`);
            return;
        }
        
        const nodes = await this.nodesRepository.getAllActive();
       
        for (const node of nodes) {
            try {
                const { response } = await this.nodeApiService.updateUser(node.host, node.port, {
                    uuid: user.uuid,
                    username: user.username,
                    password: user.password,
                    expireAt: user.expireAt,
                });
                
                if (response.success) {
                    this.logger.log(`User [${ node.uuid }] updated on node [${ node.uuid }] successfully`);
                } else {
                    this.logger.error(
                        `Failed to update user [${ node.uuid }] on node [${ node.uuid }] with error: ${ response.error }`,
                    );
                }
            } catch (error) {
                this.logger.error(
                    `Fatal error while updating user [${ node.uuid }] on node [${ node.uuid }]: ${ error }`,
                );
            }
        }
    }
}