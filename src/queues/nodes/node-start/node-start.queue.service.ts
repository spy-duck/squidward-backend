import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QUEUES } from '@/queues/queue.enum';

import { NodeStartJobNames } from './enums';

@Injectable()
export class NodeStartQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_START)));

    constructor(
        @InjectQueue(QUEUES.NODE_START) private readonly queue: Queue,
    ) {}
    
    public async startNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for start node', payload);
        return this.queue.add(NodeStartJobNames.nodeStart, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStartJobNames.nodeStart}-${payload.nodeUuid}`,
        });
    }
}