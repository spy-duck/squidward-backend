import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { chunk } from 'lodash-es';
import { Job } from 'bullmq';

import { UsersMetricsRepository } from '@/modules/users/repositories/users-metrics.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeApiService } from '@/common/node-api/node-api.service';
import { UserMetricsEntity } from '@/modules/users/entities';
import { NodeEntity } from '@/modules/nodes/entities';
import { QUEUES } from '@/queues/queue.enum';

import { MetricsUsersContract } from '@squidward-node/contracts';


@Processor(QUEUES.NODE_GET_USERS_METRICS, {
    concurrency: 40,
})
export class NodeGetUsersMetricsQueueProcessor extends WorkerHost {
    private readonly logger = new Logger(NodeGetUsersMetricsQueueProcessor.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly usersMetricsRepository: UsersMetricsRepository,
        private readonly nodeApiService: NodeApiService,
    ) {
        super();
    }
    
    async process(job: Job<{ nodeUuid: string }>) {
        this.logger.log(`Get user metrics from node with uuid ${ job.data.nodeUuid }`);
        
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
    
    private async getMetrics(node: NodeEntity): Promise<MetricsUsersContract.Response['response'] | undefined> {
        try {
            const response = await this.nodeApiService.getNodeUsersMetrics(node.host, node.port);
            return response.response;
        } catch (error) {
            this.logger.error(error);
        }
    }
    
    private async saveMetrics(
        node: NodeEntity,
        metrics: MetricsUsersContract.Response['response'],
    ) {
        for (const part of chunk(metrics, 500)) {
            await this.usersMetricsRepository.save(
                part.map((metric) =>
                    new UserMetricsEntity({
                        userUuid: metric.usr,
                        nodeUuid: node.uuid,
                        upload: metric.up,
                        download: metric.down,
                        total: metric.up + metric.down,
                    }),
                ),
            )
        }
    }
}
