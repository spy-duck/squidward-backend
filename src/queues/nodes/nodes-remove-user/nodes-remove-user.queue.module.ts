import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { NodeApiModule } from '@/common/node-api/node-api.module';
import { QUEUES } from '@/queues/queue.enum';

import { NodesRemoveUserQueueProcessor } from './nodes-remove-user.queue.processor';
import { NodesRemoveUserQueueService } from './nodes-remove-user.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        NodesRemoveUserQueueProcessor,
    ]
    : [];
const imports = isProcessorsInstance() ? [ NodeApiModule ] : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODES_REMOVE_USER }),
        BullBoardModule.forFeature({ name: QUEUES.NODES_REMOVE_USER, adapter: BullMQAdapter }),
        ...imports,
    ],
    providers: [
        ...providers,
        NodesRemoveUserQueueService,
    ],
    exports: [
        NodesRemoveUserQueueService,
    ],
})
export class NodesRemoveUserQueueModule {}