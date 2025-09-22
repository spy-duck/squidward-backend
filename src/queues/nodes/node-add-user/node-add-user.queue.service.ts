import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

import { camelCase, upperFirst } from 'lodash-es';
import { Queue } from 'bullmq';

import { NodeAddUserPayloadInterface } from '@/queues/nodes/node-add-user/interfaces';
import { QUEUES } from '@/queues/queue.enum';

import { NodeAddUserJobNames } from './enums';

@Injectable()
export class NodeAddUserQueueService {
    protected readonly logger: Logger = new Logger(upperFirst(camelCase(QUEUES.NODE_ADD_USER)));

    constructor(
        @InjectQueue(QUEUES.NODE_ADD_USER) private readonly queue: Queue,
    ) {}
    
    public async addUser(payload: NodeAddUserPayloadInterface) {
        this.logger.log('Task for add user to node', payload);
        return this.queue.add(NodeAddUserJobNames.nodeAddUser, payload, {
            removeOnComplete: true,
            removeOnFail: true,
            jobId: `${NodeAddUserJobNames.nodeAddUser}-${payload.nodeUuid}-${payload.userUuid}`,
        });
    }
}