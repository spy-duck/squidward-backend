import { Module } from '@nestjs/common';

import { NodeRestartQueueModule, NodeStartQueueModule, NodeStopQueueModule } from '@/queues';
import { CertsRepository } from '@/modules/certs/repositories/certs.repository';

import { NodesRepository } from './repositories/nodes.repository';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
    imports: [ NodeRestartQueueModule, NodeStartQueueModule, NodeStopQueueModule ],
    controllers: [ NodesController ],
    providers: [
        CertsRepository, 
        NodesRepository, 
        NodesService,
    ],
})
export class NodesModule {}