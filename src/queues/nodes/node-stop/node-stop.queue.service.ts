import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStopJobNames } from './enums';

@Injectable()
export class NodeStopQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_START)));

    constructor(
        @InjectQueue(QUEUES.NODE_STOP) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async stopNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for stop node', payload);
        return this.queue.add(NodeStopJobNames.nodeStop, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeStopJobNames.nodeStop}-${payload.nodeUuid}`,
        });
    }
}