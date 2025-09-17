import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { isProcessorsInstance } from '@/common/utils/environment';
import { QUEUES } from '@/queues/queue.enum';

import { NodeStartQueueProcessor } from './node-start.queue.processor';
import { NodeStartQueueService } from './node-start.queue.service';

const providers = isProcessorsInstance()
    ? [
        NodesRepository,
        ConfigsRepository,
        UsersRepository,
        NodeStartQueueProcessor,
    ]
    : [];

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUES.NODE_START }),
        BullBoardModule.forFeature({ name: QUEUES.NODE_START, adapter: BullMQAdapter }),
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