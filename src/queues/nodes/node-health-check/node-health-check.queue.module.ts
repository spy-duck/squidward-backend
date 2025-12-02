import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeHealthCheckQueueProcessor } from './node-health-check.queue.processor';
import { NodeHealthCheckQueueService } from './node-health-check.queue.service';
import { NodeStartQueueModule } from '../node-start';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        NodeHealthCheckQueueProcessor,
    ]
    : [];

const imports = isProcessorsInstance() ? [
    NodeStartQueueModule,
    NodeApiModule,
] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_HEALTH_CHECK }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_HEALTH_CHECK, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodeHealthCheckQueueService,
    ],
    exports: [
        NodeHealthCheckQueueService,
    ],
})
export class NodeHealthCheckQueueModule {}