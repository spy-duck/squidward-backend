import { Module } from '@nestjs/common';

import { ConfigsModule } from '@/modules/configs/configs.module';
import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
    imports: [
        AdminModule,
        AuthModule,
        NodesModule,
        UsersModule,
        ConfigsModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
