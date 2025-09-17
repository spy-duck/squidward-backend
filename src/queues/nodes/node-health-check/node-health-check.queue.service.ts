import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QUEUES } from '@/queues/queue.enum';

import { NodeStopJobNames } from './enums';

@Injectable()
export class NodeHealthCheckQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_HEALTH_CHECK)));

    constructor(
        @InjectQueue(QUEUES.NODE_HEALTH_CHECK) private readonly queue: Queue,
    ) {}
    
    public async healthCheckNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for health check node', payload);
        return this.queue.add(NodeStopJobNames.nodeHealthCheck, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStopJobNames.nodeHealthCheck}-${payload.nodeUuid}`,
        });
    }
}