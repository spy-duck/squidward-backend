import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStopJobNames } from './enums';

@Injectable()
export class NodeHealthCheckQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_HEALTH_CHECK)));

    constructor(
        @InjectQueue(QUEUES.NODE_HEALTH_CHECK) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async healthCheckNode(payload: { nodeUuid: string }) {
        this.logger.log(`Task for health check node: ${payload.nodeUuid}`);
        await this.queue.add(NodeStopJobNames.nodeHealthCheck, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStopJobNames.nodeHealthCheck}-${payload.nodeUuid}`,
        });
    }
}