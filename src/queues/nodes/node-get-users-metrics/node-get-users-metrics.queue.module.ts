import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { UsersMetricsRepository } from '@/modules/users/repositories/users-metrics.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeGetUsersMetricsQueueProcessor } from './node-get-users-metrics.queue.processor';
import { NodeGetUsersMetricsQueueService } from './node-get-users-metrics.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        UsersMetricsRepository,
        NodeGetUsersMetricsQueueProcessor,
    ]
    : [];

const imports = isProcessorsInstance() ? [
    NodeApiModule,
] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_GET_USERS_METRICS }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_GET_USERS_METRICS, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodeGetUsersMetricsQueueService,
    ],
    exports: [
        NodeGetUsersMetricsQueueService,
    ],
})
export class NodeGetUsersMetricsQueueModule {}