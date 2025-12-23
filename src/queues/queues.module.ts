import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';

import {
    NodeStartQueueModule,
    NodeStopQueueModule,
    NodeHealthCheckQueueModule,
    NodeRestartQueueModule,
    NodesUpdateUserQueueModule,
    NodesRemoveUserQueueModule,
    NodesAddUserQueueModule,
} from './nodes';
import {
    NodeGetNodeMetricsQueueModule,
    NodeGetUsersMetricsQueueModule,
} from './metrics';

const queueModules = [
    NodeStartQueueModule,
    NodeStopQueueModule,
    NodeHealthCheckQueueModule,
    NodeRestartQueueModule,
    NodesUpdateUserQueueModule,
    NodesRemoveUserQueueModule,
    NodesAddUserQueueModule,
    NodeGetNodeMetricsQueueModule,
    NodeGetUsersMetricsQueueModule,
];

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ ConfigModule ],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.getOrThrow<string>('REDIS_HOST'),
                    port: configService.getOrThrow<number>('REDIS_PORT'),
                    db: configService.getOrThrow<number>('REDIS_DB'),
                    password: configService.get<string | undefined>('REDIS_PASSWORD'),
                },
                defaultJobOptions: {
                    removeOnComplete: 500,
                    removeOnFail: 500,
                },
            }),
            inject: [ ConfigService ],
        }),
        BullBoardModule.forRoot({
            route: '/queues',
            adapter: ExpressAdapter,
        }),
        ...queueModules,
    ],
    exports: [ ...queueModules ],
})
export class QueuesModule {}