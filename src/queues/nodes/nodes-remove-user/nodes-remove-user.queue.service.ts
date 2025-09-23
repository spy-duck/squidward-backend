import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserInterface } from './interfaces';
import { NodeRemoveUserJobNames } from './enums';

@Injectable()
export class NodesRemoveUserQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODES_REMOVE_USER)));

    constructor(
        @InjectQueue(QUEUES.NODES_REMOVE_USER) private readonly queue: Queue,
    ) {}
    
    public async removeUser(payload: NodeAddUserInterface) {
        this.logger.log('Task for remove user from nodes', payload);
        return this.queue.add(NodeRemoveUserJobNames.nodeRemoveUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeRemoveUserJobNames.nodeRemoveUser}-${payload.userUuid}`,
        });
    }
}