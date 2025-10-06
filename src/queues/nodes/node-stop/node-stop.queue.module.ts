import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStopQueueProcessor } from './node-stop.queue.processor';
import { NodeStopQueueService } from './node-stop.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        NodeStopQueueProcessor,
    ]
    : [];
const imports = isProcessorsInstance() ? [
    NodeApiModule,
] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_STOP }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_STOP, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodeStopQueueService,
    ],
    exports: [
        NodeStopQueueService,
    ],
})
export class NodeStopQueueModule {}