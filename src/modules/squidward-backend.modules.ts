import { Module } from '@nestjs/common';

import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
    imports: [
        NodesModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
