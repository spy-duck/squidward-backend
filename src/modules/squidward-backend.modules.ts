import { Module } from '@nestjs/common';

import { UsersModule } from '@/modules/nodes/nodes.module';

@Module({
    imports: [
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class SquidwardBackendModules {}
