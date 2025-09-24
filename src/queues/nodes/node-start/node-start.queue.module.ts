import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesSharedService } from '@/queues/nodes/nodes-shared/nodes-shared.service';
import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeHealthCheckQueueModule } from '../node-health-check/node-health-check.queue.module';
import { NodeStartQueueProcessor } from './node-start.queue.processor';
import { NodeStartQueueService } from './node-start.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        ConfigsRepository,
        UsersRepository,
        NodesSharedService,
        NodeStartQueueProcessor,
    ]
    : []

const imports = isProcessorsInstance() ? [ NodeHealthCheckQueueModule, NodeApiModule ] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_START }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_START, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodeStartQueueService,
    ],
    exports: [
        NodeStartQueueService,
    ],
})
export class NodeStartQueueModule {}