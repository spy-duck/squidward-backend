import { Module } from '@nestjs/common';

import { NodeStartQueueModule, NodeStopQueueModule } from '@/queues';

import { NodesRepository } from './repositories/nodes.repository';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
    imports: [ NodeStartQueueModule, NodeStopQueueModule ],
    controllers: [ NodesController ],
    providers: [ NodesRepository, NodesService ],
})
export class NodesModule {}