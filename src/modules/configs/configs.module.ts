import { Module } from '@nestjs/common';

import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { NodeRestartQueueModule } from '@/queues';

import { ConfigsRepository } from './repositories/configs.repository';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Module({
    imports: [ NodeRestartQueueModule ],
    controllers: [ ConfigsController ],
    providers: [
        NodesRepository,
        ConfigsRepository, 
        ConfigsService
    ],
})
export class ConfigsModule {}