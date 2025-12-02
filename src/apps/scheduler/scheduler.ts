import { NestFactory } from '@nestjs/core';

import { WinstonModule } from 'nest-winston';

import { SchedulerRootModule } from '@/apps/scheduler/scheduler.root.module';
import { getLogger } from '@/common/setup-app';


async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(SchedulerRootModule, {
        logger: WinstonModule.createLogger({
            instance: getLogger('Scheduler', process.env.INSTANCE_ID || '0'),
        }),
    });
    
    app.enableShutdownHooks();
    
    await app.init();
}
bootstrap();