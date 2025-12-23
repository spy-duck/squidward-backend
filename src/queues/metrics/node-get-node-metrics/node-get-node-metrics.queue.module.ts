import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodesMetricsRepository } from '@/modules/nodes/repositories';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeGetNodeMetricsQueueProcessor } from './node-get-node-metrics.queue.processor';
import { NodeGetNodeMetricsQueueService } from './node-get-node-metrics.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        NodesMetricsRepository,
        NodeGetNodeMetricsQueueProcessor,
    ]
    : [];

const imports = isProcessorsInstance() ? [
    NodeApiModule,
] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_GET_NODE_METRICS }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_GET_NODE_METRICS, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodeGetNodeMetricsQueueService,
    ],
    exports: [
        NodeGetNodeMetricsQueueService,
    ],
})
export class NodeGetNodeMetricsQueueModule {}