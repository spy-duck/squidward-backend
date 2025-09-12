import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { JOBS_INTERVALS } from '@/scheduler/intervals';
import { NodeApi } from '@/common/node-api/node-api';


@Injectable()
export class NodeHealthCheckTask {
    private static readonly CRON_NAME = 'nodeHealthCheck';
    private readonly logger = new Logger(NodeHealthCheckTask.name);
    private cronName = NodeHealthCheckTask.CRON_NAME;
    
    private isNodesRestarted: boolean;
    constructor(
        private readonly nodesRepository: NodesRepository,
    ) {}
    
    @Cron(JOBS_INTERVALS.NODE_HEALTH_CHECK, {
        name: NodeHealthCheckTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        try {
            const nodes = await this.getEnabledNodes();
            for (const node of nodes) {
                try {
                    new NodeApi(node.host, node.port);
                } catch (error) {
                    this.logger.error(error);
                    await this.setNodeErrored(node);
                }
            }
        } catch (error) {
            this.logger.error(`Error in NodeHealthCheckService: ${error}`);
        }
    }
    
    private async setNodeErrored(node: NodeEntity): Promise<void> {
        await this.nodesRepository.update({
            ...node,
            isConnected: false,
        });
    }
    
    private async getEnabledNodes(): Promise<NodeEntity[]> {
        return this.nodesRepository.getEnabledList();
    }
}