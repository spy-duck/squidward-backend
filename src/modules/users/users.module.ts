import { Module } from '@nestjs/common';

import { NodesAddUserQueueModule, NodesRemoveUserQueueModule, NodesUpdateUserQueueModule } from '@/queues';
import { UsersMetricsRepository } from '@/modules/users/repositories';

import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        NodesAddUserQueueModule,
        NodesRemoveUserQueueModule,
        NodesUpdateUserQueueModule,
    ],
    controllers: [ UsersController ],
    providers: [ 
        UsersRepository,
        UsersMetricsRepository, 
        UsersService,
    ],
})
export class UsersModule {}