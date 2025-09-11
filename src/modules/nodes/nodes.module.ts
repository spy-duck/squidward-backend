import { Module } from '@nestjs/common';

import { NodesRepository } from './repositories/nodes.repository';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

@Module({
    imports: [],
    controllers: [ NodesController ],
    providers: [ NodesRepository, NodesService ],
})
export class UsersModule {}