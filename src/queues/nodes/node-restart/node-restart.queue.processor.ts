import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesQueueSharedService } from '@/queues/nodes/nodes-queue-shared.service';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeHealthCheckQueueService } from '@/queues';
import { NodeApi } from '@/common/node-api/node-api';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_RESTART, {
    concurrency: 40,
})
export class NodeRestartQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeRestartQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodesQueueSharedService: NodesQueueSharedService,
        private readonly nodeHealthCheckQueueService: NodeHealthCheckQueueService,
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
        
        const nodeApi = new NodeApi(node.host, node.port);
        
        const isSetupSuccess = await this.nodesQueueSharedService.setupNode(nodeApi, node);
        if (!isSetupSuccess) {
            this.logger.error('Node setup failed');
            return;
        }
        
        const { response } = await nodeApi.squidRestart();
        
        if (response.success) {
            await this.nodeHealthCheckQueueService.healthCheckNode({ nodeUuid: node.uuid });
            this.logger.log(`Node ${ node.name } [${ node.uuid }] restarted successfully`);
        } else {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to restart with error: ${ response.error }`,
            );
        }
    }
}