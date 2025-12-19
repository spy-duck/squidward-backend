import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

import { DatabaseOptions } from '@/database/definition/database.module-definition';
import { NodesRepository } from '@/modules/nodes/repositories/nodes.repository';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { DatabaseModule } from '@/database/definition/database.module';
import { QueuesModule } from '@/queues/queues.module';
import * as tasks from '@/scheduler/tasks';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        DatabaseModule.forRootAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: (config: ConfigService) => ({
                host: config.get('POSTGRES_HOST'),
                port: config.get('POSTGRES_PORT'),
                database: config.get('POSTGRES_DB'),
                user: config.get('POSTGRES_USER'),
                password: config.get('POSTGRES_PASSWORD'),
            } as DatabaseOptions),
        }),
        ScheduleModule.forRoot(),
        QueuesModule,
    ],
    providers: [
        NodesRepository,
        UsersRepository,
        ...Object.values(tasks),
    ],
})
export class SchedulerModule {}
