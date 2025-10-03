import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QueuesService } from '@/queues/queues.service';
import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserInterface } from './interfaces';
import { NodeAddUserJobNames } from './enums';

@Injectable()
export class NodesAddUserQueueService extends QueuesService implements OnApplicationBootstrap {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODES_ADD_USER)));

    constructor(
        @InjectQueue(QUEUES.NODES_ADD_USER) protected readonly queue: Queue,
    ) {
        super();
    }
    
    async onApplicationBootstrap() {
        await this.checkConnection();
        await this.drain();
    }
    
    public async addUser(payload: NodeAddUserInterface) {
        this.logger.log('Task for add user to nodes', payload);
        return this.queue.add(NodeAddUserJobNames.nodeAddUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeAddUserJobNames.nodeAddUser}-${payload.userUuid}`,
        });
    }
}