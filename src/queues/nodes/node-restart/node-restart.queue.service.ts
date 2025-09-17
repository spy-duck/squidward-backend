import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QUEUES } from '@/queues/queue.enum';

import { NodeRestartJobNames } from './enums';

@Injectable()
export class NodeRestartQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_RESTART)));

    constructor(
        @InjectQueue(QUEUES.NODE_RESTART) private readonly queue: Queue,
    ) {}
    
    public async restartNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for restart node', payload);
        return this.queue.add(NodeRestartJobNames.nodeRestart, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeRestartJobNames.nodeRestart}-${payload.nodeUuid}`,
        });
    }
}