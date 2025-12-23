import { Module } from '@nestjs/common';

import { NodeRestartQueueModule, NodeStartQueueModule, NodeStopQueueModule } from '@/queues';
import { CertsRepository } from '@/modules/certs/repositories/certs.repository';
import { HostsRepository } from '@/modules/hosts/repositories/hosts.repository';

import { NodesRepository, NodesMetricsRepository } from './repositories';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
    imports: [ NodeRestartQueueModule, NodeStartQueueModule, NodeStopQueueModule ],
    controllers: [ NodesController ],
    providers: [
        CertsRepository, 
        NodesRepository, 
        HostsRepository,
        NodesMetricsRepository, 
        NodesService,
    ],
})
export class NodesModule {}