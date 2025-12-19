import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeGetUsersMetricsJobNames } from './enums';

@Injectable()
export class NodeGetUsersMetricsQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_GET_USERS_METRICS)));

    constructor(
        @InjectQueue(QUEUES.NODE_GET_USERS_METRICS) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async getNodeUsersMetrics(payload: { nodeUuid: string }) {
        this.logger.log(`Task for get node metrics: ${payload.nodeUuid}`);
        await this.queue.add(NodeGetUsersMetricsJobNames.nodeGetUsersMetrics, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeGetUsersMetricsJobNames.nodeGetUsersMetrics}-${payload.nodeUuid}`,
        });
    }
}