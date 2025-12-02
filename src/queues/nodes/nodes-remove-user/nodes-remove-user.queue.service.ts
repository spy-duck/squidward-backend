import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserInterface } from './interfaces';
import { NodeRemoveUserJobNames } from './enums';

@Injectable()
export class NodesRemoveUserQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODES_REMOVE_USER)));

    constructor(
        @InjectQueue(QUEUES.NODES_REMOVE_USER) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async removeUser(payload: NodeAddUserInterface) {
        this.logger.log('Task for remove user from nodes', payload);
        return this.queue.add(NodeRemoveUserJobNames.nodeRemoveUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeRemoveUserJobNames.nodeRemoveUser}-${payload.userUuid}`,
        });
    }
}