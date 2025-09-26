import { Module } from '@nestjs/common';

import { AdminModule } from '@/modules/admin/admin.module';
import { ApiTokensModule } from '@/modules/api-tokens/api-tokens.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigsModule } from '@/modules/configs/configs.module';
import { NodesModule } from '@/modules/nodes/nodes.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
    imports: [
        AdminModule,
        ApiTokensModule,
        AuthModule,
        ConfigsModule,
        NodesModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
