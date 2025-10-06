import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesSharedService } from '@/queues/nodes/nodes-shared/nodes-shared.service';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { QUEUES } from '@/queues/queue.enum';

@Processor(QUEUES.NODE_START, {
    concurrency: 40,
})
export class NodeStartQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeStartQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodesSharedService: NodesSharedService,
        private readonly nodeApiService: NodeApiService,
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
        
        const isSetupSuccess = await this.nodesSharedService.setupNode(node);
        
        if (!isSetupSuccess) {
            this.logger.error('Node setup failed');
            return;
        }
        
        const { response } = await this.nodeApiService.squidStart(node.host, node.port);
        
        console.log(response);
        
        if (response.success) {
            await this.nodesRepository.update({
                ...node,
                isStarted: true,
            });
            
            this.logger.log(`Node ${ node.name } [${ node.uuid }] started successfully`);
        } else {
            this.logger.error(
                `Node ${ node.name } [${ node.uuid }] failed to start with error: ${ response.error }`,
            );
        }
    }
}