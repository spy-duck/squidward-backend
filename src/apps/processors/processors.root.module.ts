import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { DatabaseOptions } from '@/database/definition/database.module-definition';
import { DatabaseModule } from '@/database/definition/database.module';
import { QueuesModule } from '@/queues/queues.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        DatabaseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ ConfigService ],
            useFactory: (config: ConfigService) => ({
                host: config.get('POSTGRES_HOST'),
                port: config.get('POSTGRES_PORT'),
                database: config.get('POSTGRES_DB'),
                user: config.get('POSTGRES_USER'),
                password: config.get('POSTGRES_PASSWORD'),
            } as DatabaseOptions),
        }),
        QueuesModule,
    ],
})
export class ProcessorsRootModule {}