
import { NestFactory } from '@nestjs/core';

import { WinstonModule } from 'nest-winston';

import { ProcessorsRootModule } from '@/apps/processors/processors.root.module';
import { getLogger } from '@/common/setup-app';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ProcessorsRootModule, {
        logger: WinstonModule.createLogger({
            instance: getLogger('Processors', process.env.INSTANCE_ID || '0'),
        }),
    });
    
    app.enableShutdownHooks();
    
    await app.init();
}
bootstrap();