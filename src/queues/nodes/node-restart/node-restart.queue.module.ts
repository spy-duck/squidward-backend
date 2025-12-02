import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesSetupService } from '@/queues/nodes/nodes-setup/nodes-setup.service';
import { NodesSetupModule } from '@/queues/nodes/nodes-setup/nodes-setup.module';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodeRestartQueueProcessor } from './node-restart.queue.processor';
import { NodeRestartQueueService } from './node-restart.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        NodesSetupService,
        NodeRestartQueueProcessor,
    ]
    : [];

const imports = isProcessorsInstance() ? [
    NodesSetupModule,
    NodeApiModule,
] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_RESTART }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_RESTART, adapter: BullMQAdapter }),
        ...imports,
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
