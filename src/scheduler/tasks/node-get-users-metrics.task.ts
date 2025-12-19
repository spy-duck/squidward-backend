import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { camelCase } from 'lodash-es';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeGetUsersMetricsQueueService } from '@/queues';
import { JOBS_INTERVALS } from '@/scheduler/intervals';


@Injectable()
export class NodeUsersMetricsTask {
    private static readonly CRON_NAME = camelCase(NodeUsersMetricsTask.name);
    private readonly logger = new Logger(NodeUsersMetricsTask.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeGetUsersMetricsQueueService: NodeGetUsersMetricsQueueService,
    ) {}
    
    @Cron(JOBS_INTERVALS.NODE_GET_USERS_METRICS, {
        name: NodeUsersMetricsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            const nodes = await this.nodesRepository.getAllActive();
            await Promise.allSettled(
                nodes.map(node => this.nodeGetUsersMetricsQueueService.getNodeUsersMetrics({
                    nodeUuid: node.uuid
                })),
            );
        } catch (error) {
            this.logger.error(`Error in NodeGetUsersMetricsQueueService: ${ error }`);
        }
    }
}