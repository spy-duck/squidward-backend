import { Module } from '@nestjs/common';

import { HostsRepository } from './repositories/hosts.repository';
import { HostsController } from './hosts.controller';
import { HostsService } from './hosts.service';

@Module({
    imports: [],
    controllers: [ HostsController ],
    providers: [ HostsRepository, HostsService ],
})
export class HostsModule {}