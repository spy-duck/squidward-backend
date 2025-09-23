
import { Module } from '@nestjs/common';

import { ConfigsRepository } from '@/modules/configs/repositories/configs.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';

import { NodesSharedService } from './nodes-shared.service';

@Module({
    imports: [],
    providers: [
        UsersRepository,
        ConfigsRepository,
        NodesSharedService,
    ],
    exports: [
        UsersRepository,
        ConfigsRepository,
        NodesSharedService,
    ],
})
export class NodesSharedModule {}