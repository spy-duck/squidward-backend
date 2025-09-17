import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NODE_STATE, TNodeState } from '@contract/constants';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_HEALTH_CHECK, {
    concurrency: 40,
})
export class NodeHealthCheckQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeHealthCheckQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Node health check with uuid ${ job.data.nodeUuid }`);
        
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        
        
        try {
            const nodeApi = new NodeApi(node.host, node.port);
            
            const result = await nodeApi.getStatus();
            
            await this.nodesRepository.update({
                ...node,
                isConnected: true,
                state: result.response.state as TNodeState,
            });
        } catch (error) {
            this.logger.error(error);
            await this.nodesRepository.update({
                ...node,
                isConnected: false,
                state: NODE_STATE.OFFLINE,
            });
        }
    }
}