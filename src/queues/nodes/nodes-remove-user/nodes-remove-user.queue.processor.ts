import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserInterface } from './interfaces';

@Processor(QUEUES.NODES_REMOVE_USER, {
    concurrency: 40,
})
export class NodesRemoveUserQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodesRemoveUserQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
    ) {
        super();
    }
    
    async process(job: Job<NodeAddUserInterface>) {
        this.logger.log(`Starting remove user ${ job.data.userUuid } from nodes`);
        
        const nodes = await this.nodesRepository.getAllActive();
       
        for (const node of nodes) {
            const nodeApi = new NodeApi(node.host, node.port);
            try {
                const { response } = await nodeApi.removeUser({
                    userUuid: job.data.userUuid,
                });
                
                if (response.success) {
                    this.logger.log(`User [${ node.uuid }] removed from node [${ node.uuid }] successfully`);
                } else {
                    this.logger.error(
                        `Failed to remove user [${ node.uuid }] from node [${ node.uuid }] with error: ${ response.error }`,
                    );
                }
            } catch (error) {
                this.logger.error(
                    `Fatal error while removing user [${ node.uuid }] from node [${ node.uuid }]: ${ error }`,
                );
            }
        }
    }
}