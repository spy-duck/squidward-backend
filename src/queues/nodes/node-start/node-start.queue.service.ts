import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStartJobNames } from './enums';

@Injectable()
export class NodeStartQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_START)));

    constructor(
        @InjectQueue(QUEUES.NODE_START) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async startNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for start node', payload);
        return this.queue.add(NodeStartJobNames.nodeStart, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStartJobNames.nodeStart}-${payload.nodeUuid}`,
        });
    }
}