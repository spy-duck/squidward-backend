import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeEntity, NodeMetricsEntity } from '@/modules/nodes/entities';
import { NodesMetricsRepository } from '@/modules/nodes/repositories';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { QUEUES } from '@/queues/queue.enum';

import { MetricsNodeContract } from '@squidward-node/contracts';


@Processor(QUEUES.NODE_GET_NODE_METRICS, {
    concurrency: 40,
})
export class NodeGetNodeMetricsQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeGetNodeMetricsQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodesMetricsRepository: NodesMetricsRepository,
        private readonly nodeApiService: NodeApiService,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Get node metrics from node with uuid ${ job.data.nodeUuid }`);
        
        const node = await this.nodesRepository.getByUuid(job.data.nodeUuid);
        
        if (!node) {
            this.logger.error(`Node with uuid ${ job.data.nodeUuid } not found`);
            return;
        }
        
        const metrics = await this.getMetrics(node);

        if (metrics) {
            await this.saveMetrics(node, metrics);
        }
    }
    
    private async getMetrics(node: NodeEntity): Promise<MetricsNodeContract.Response['response'] | undefined> {
        try {
            const response = await this.nodeApiService.getNodeMetrics(node.host, node.port);
            return response.response;
        } catch (error) {
            this.logger.error(error);
        }
    }
    
    private async saveMetrics(
        node: NodeEntity,
        metrics: MetricsNodeContract.Response['response'],
    ) {
        const aggregated = metrics.reduce((acc, curr) => {
            acc.up += curr.up;
            acc.down += curr.down;
            return acc;
        }, {
            up: BigInt(0),
            down: BigInt(0),
        });
        
        await this.nodesMetricsRepository.save(
            new NodeMetricsEntity({
                nodeUuid: node.uuid,
                upload: aggregated.up,
                download: aggregated.down,
                total: aggregated.up + aggregated.down,
            }),
        )
    }
}
