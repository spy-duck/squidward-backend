import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { QUEUES } from '@/queues/queue.enum';

import { NodeUpdateUserInterface } from './interfaces';
import { NodeUpdateUserJobNames } from './enums';

@Injectable()
export class NodesUpdateUserQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODES_UPDATE_USER)));

    constructor(
        @InjectQueue(QUEUES.NODES_UPDATE_USER) private readonly queue: Queue,
    ) {}
    
    public async updateUser(payload: NodeUpdateUserInterface) {
        this.logger.log('Task for update user on nodes', payload);
        return this.queue.add(NodeUpdateUserJobNames.nodeUpdateUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeUpdateUserJobNames.nodeUpdateUser}-${payload.userUuid}`,
        });
    }
}