import { Module } from '@nestjs/common';

import { ConfigsModule } from '@/modules/configs/configs.module';
import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        NodesModule,
        UsersModule,
        ConfigsModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
