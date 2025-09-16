import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { NodeStartJobNames } from '@/queues/node-start/enums';
import { QUEUES } from '@/queues/queue.enum';

@Injectable()
export class NodeStartQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_START)));

    constructor(
        @InjectQueue(QUEUES.NODE_START) private readonly nodeStartQueue: Queue,
    ) {}
    
    public async startNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for start node', payload);
        return this.nodeStartQueue.add(NodeStartJobNames.nodeStart, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStartJobNames.nodeStart}-${payload.nodeUuid}`,
        });
    }
}