import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { QUEUES } from '@/queues/queue.enum';

import { NodeHealthCheckQueueModule } from '../node-health-check/node-health-check.queue.module';
import { NodesUpdateUserQueueProcessor } from './nodes-update-user.queue.processor';
import { NodesUpdateUserQueueService } from './nodes-update-user.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        UsersRepository,
        NodesUpdateUserQueueProcessor,
    ]
    : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODES_UPDATE_USER }),
        BullBoardModule.forFeature({ name: QUEUES.NODES_UPDATE_USER, adapter: BullMQAdapter }),
        NodeHealthCheckQueueModule,
    ],
    providers: [
        ...providers,
        NodesUpdateUserQueueService,
    ],
    exports: [
        NodesUpdateUserQueueService,
    ],
})
export class NodesUpdateUserQueueModule {}