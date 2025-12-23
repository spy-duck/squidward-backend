import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { camelCase } from 'lodash-es';

import { NodesRepository } from '@/modules/nodes/repositories';
import { NodeGetNodeMetricsQueueService } from '@/queues';
import { JOBS_INTERVALS } from '@/scheduler/intervals';


@Injectable()
export class NodeNodeMetricsTask {
    private static readonly CRON_NAME = camelCase(NodeNodeMetricsTask.name);
    private readonly logger = new Logger(NodeNodeMetricsTask.name);
    
    constructor(
        private readonly nodesRepository: NodesRepository,
        private readonly nodeGetNodeMetricsQueueService: NodeGetNodeMetricsQueueService,
    ) {}
    
    @Cron(JOBS_INTERVALS.NODE_GET_NODE_METRICS, {
        name: NodeNodeMetricsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            const nodes = await this.nodesRepository.getAllActive();
            await Promise.allSettled(
                nodes.map(node => this.nodeGetNodeMetricsQueueService.getNodeMetrics({
                    nodeUuid: node.uuid
                })),
            );
        } catch (error) {
            this.logger.error(`Error in ${NodeNodeMetricsTask.name}: ${ error }`);
        }
    }
}