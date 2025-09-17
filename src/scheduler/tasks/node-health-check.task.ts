import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { JOBS_INTERVALS } from '@/scheduler/intervals';
import { NodeHealthCheckQueueService } from '@/queues';


@Injectable()
export class NodeHealthCheckTask {
    private static readonly CRON_NAME = 'nodeHealthCheck';
    private readonly logger = new Logger(NodeHealthCheckTask.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeHealthCheckQueueService: NodeHealthCheckQueueService,
    ) {}
    
    @Cron(JOBS_INTERVALS.NODE_HEALTH_CHECK, {
        name: NodeHealthCheckTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            const nodes = await this.nodesRepository.getAll();
            await Promise.allSettled(
                nodes.map(node => this.nodeHealthCheckQueueService.healthCheckNode({ nodeUuid: node.uuid })),
            );
        } catch (error) {
            this.logger.error(`Error in NodeHealthCheckService: ${ error }`);
        }
    }
}