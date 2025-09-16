import { Module } from '@nestjs/common';

import { NodeStartQueueModule } from '@/queues/node-start/node-start.queue.module';

import { NodesRepository } from './repositories/nodes.repository';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
    imports: [NodeStartQueueModule],
    controllers: [ NodesController ],
    providers: [ NodesRepository, NodesService ],
})
export class NodesModule {}