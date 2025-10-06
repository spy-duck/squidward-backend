import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { NODE_STATE, TNodeState } from '@contract/constants';
import { NodeEntity } from '@/modules/nodes/entities';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStartQueueService } from '../node-start/node-start.queue.service';

@Processor(QUEUES.NODE_HEALTH_CHECK, {
    concurrency: 40,
})
export class NodeHealthCheckQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeHealthCheckQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeApiService: NodeApiService,
        private readonly nodeStartQueueService: NodeStartQueueService,
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
            const result = await this.nodeApiService.healthCheck(node.host, node.port);
            
            const updatedNode = await this.nodesRepository.update({
                ...node,
                isConnected: true,
                state: result.response.state as TNodeState,
            });
            
            if (!node.isConnected) {
                await this.handlerNodeConnected(updatedNode);
            }
        } catch (error) {
            this.logger.error(error);
            await this.nodesRepository.update({
                ...node,
                isConnected: false,
                state: NODE_STATE.OFFLINE,
            });
        }
    }
    
    private async handlerNodeConnected(node: NodeEntity) {
        if (node.isStarted) {
            await this.nodeStartQueueService.startNode({
                nodeUuid: node.uuid,
            });
        }
    }
}