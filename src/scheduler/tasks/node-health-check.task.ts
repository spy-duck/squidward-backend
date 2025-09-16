import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NODE_STATE, TNodeState } from '@contract/constants/nodes/node.state';
import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { JOBS_INTERVALS } from '@/scheduler/intervals';
import { NodeApi } from '@/common/node-api/node-api';


@Injectable()
export class NodeHealthCheckTask {
    private static readonly CRON_NAME = 'nodeHealthCheck';
    private readonly logger = new Logger(NodeHealthCheckTask.name);
    
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
            await Promise.allSettled(
                nodes.map(node => this.checkNodeStatus(node)),
            );
        } catch (error) {
            this.logger.error(`Error in NodeHealthCheckService: ${ error }`);
        }
    }
    
    private async checkNodeStatus(node: NodeEntity): Promise<void> {
        try {
            const result = await new NodeApi(node.host, node.port).getStatus();
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
    
    private async getEnabledNodes(): Promise<NodeEntity[]> {
        return this.nodesRepository.getAll();
    }
}