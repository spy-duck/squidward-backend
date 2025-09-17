import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { NodesQueueSharedService } from '@/queues/nodes/nodes-queue-shared.service';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { QUEUES } from '@/queues/queue.enum';

import { NodeHealthCheckQueueModule } from '../node-health-check/node-health-check.queue.module';
import { NodeRestartQueueProcessor } from './node-restart.queue.processor';
import { NodeRestartQueueService } from './node-restart.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        ConfigsRepository,
        UsersRepository,
        NodesQueueSharedService,
        NodeRestartQueueProcessor,
    ]
    : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_RESTART }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_RESTART, adapter: BullMQAdapter }),
        NodeHealthCheckQueueModule,
    ],
    providers: [
        ...providers,
        NodeRestartQueueService,
    ],
    exports: [
        NodeRestartQueueService,
    ],
})
export class NodeRestartQueueModule {}