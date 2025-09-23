import { Module } from '@nestjs/common';

import { NodesAddUserQueueModule, NodesRemoveUserQueueModule, NodesUpdateUserQueueModule } from '@/queues';

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
    providers: [ UsersRepository, UsersService ],
})
export class UsersModule {}