import { Module } from '@nestjs/common';

import { ConfigsModule } from '@/modules/configs/configs.module';
import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
    imports: [
        NodesModule,
        UsersModule,
        ConfigsModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
