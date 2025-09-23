import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { QUEUES } from '@/queues/queue.enum';

import { NodeHealthCheckQueueModule } from '../node-health-check/node-health-check.queue.module';
import { NodesAddUserQueueProcessor } from './nodes-add-user.queue.processor';
import { NodesAddUserQueueService } from './nodes-add-user.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        UsersRepository,
        NodesAddUserQueueProcessor,
    ]
    : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODES_ADD_USER }),
        BullBoardModule.forFeature({ name: QUEUES.NODES_ADD_USER, adapter: BullMQAdapter }),
        NodeHealthCheckQueueModule,
    ],
    providers: [
        ...providers,
        NodesAddUserQueueService,
    ],
    exports: [
        NodesAddUserQueueService,
    ],
})
export class NodesAddUserQueueModule {}