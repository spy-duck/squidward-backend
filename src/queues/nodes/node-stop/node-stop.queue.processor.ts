import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_STOP, {
    concurrency: 40,
})
export class NodeStopQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeStopQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeApiService: NodeApiService,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Stopping node with uuid ${ job.data.nodeUuid }`);
        
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
     
        const { response } = await this.nodeApiService.squidStop(node.host, node.port);
        
        if (response.success) {
            
            await this.nodesRepository.update({
                ...node,
                isStarted: false,
            });
            
            this.logger.log(`Node ${ node.name } [${ node.uuid }] stopped successfully`);
        } else {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to stop with error: ${ response.error }`,
            );
        }
    }
}