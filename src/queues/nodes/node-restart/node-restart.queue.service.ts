import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeRestartJobNames } from './enums';

@Injectable()
export class NodeRestartQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_RESTART)));
    
    constructor(
        @InjectQueue(QUEUES.NODE_RESTART) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async restartNode(payload: { nodeUuid: string }) {
        this.logger.log('Task for restart node', payload);
        return this.queue.add(NodeRestartJobNames.nodeRestart, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${ NodeRestartJobNames.nodeRestart }-${ payload.nodeUuid }`,
        });
    }
}