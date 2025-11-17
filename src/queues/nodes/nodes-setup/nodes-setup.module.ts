
import { Module } from '@nestjs/common';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { NodeApiModule } from '@/common/node-api/node-api.module';

import { NodesSetupService } from './nodes-setup.service';

@Module({
    imports: [
        NodeApiModule,
    ],
    providers: [
        UsersRepository,
        ConfigsRepository,
        NodesSetupService,
    ],
    exports: [
        UsersRepository,
        ConfigsRepository,
        NodesSetupService,
    ],
})
export class NodesSetupModule {}