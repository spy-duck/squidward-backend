import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeUpdateUserInterface } from './interfaces';
import { NodeUpdateUserJobNames } from './enums';

@Injectable()
export class NodesUpdateUserQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODES_UPDATE_USER)));

    constructor(
        @InjectQueue(QUEUES.NODES_UPDATE_USER) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async updateUser(payload: NodeUpdateUserInterface) {
        this.logger.log('Task for update user on nodes', payload);
        return this.queue.add(NodeUpdateUserJobNames.nodeUpdateUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeUpdateUserJobNames.nodeUpdateUser}-${payload.userUuid}`,
        });
    }
}