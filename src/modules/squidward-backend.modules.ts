import { Module } from '@nestjs/common';

import { ApiTokensModule } from '@/modules/api-tokens/api-tokens.module';
import { ConfigsModule } from '@/modules/configs/configs.module';
import { AdminModule } from '@/modules/admin/admin.module';
import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';
import { HostsModule } from '@/modules/hosts/hosts.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
    imports: [
        AdminModule,
        ApiTokensModule,
        AuthModule,
        ConfigsModule,
        HostsModule,
        NodesModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
