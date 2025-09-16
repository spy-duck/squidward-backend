
import { NestFactory } from '@nestjs/core';

import { utilities as winstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston, { createLogger } from 'winston';

import { ProcessorsRootModule } from '@/apps/processors/processors.root.module';
import { isDevelopment } from '@/common/utils/is-development';

const instanedId = process.env.INSTANCE_ID || '0';

const logger = createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        // winston.format.ms(),
        winston.format.align(),
        winstonModuleUtilities.format.nestLike(`Processors: #${instanedId}`, {
            colors: true,
            prettyPrint: true,
            processId: false,
            appName: true,
        }),
    ),
    level: isDevelopment() ? 'debug' : 'http',
});

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ProcessorsRootModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });
    
    await app.init();
    
    
    app.enableShutdownHooks();
}
bootstrap();