import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeGetNodeMetricsJobNames} from './enums';

@Injectable()
export class NodeGetNodeMetricsQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_GET_NODE_METRICS)));

    constructor(
        @InjectQueue(QUEUES.NODE_GET_NODE_METRICS) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async getNodeMetrics(payload: { nodeUuid: string }) {
        this.logger.log(`Task for get node metrics: ${payload.nodeUuid}`);
        await this.queue.add(NodeGetNodeMetricsJobNames.nodeGetNodeMetrics, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeGetNodeMetricsJobNames.nodeGetNodeMetrics}-${payload.nodeUuid}`,
        });
    }
}