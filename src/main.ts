import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { utilities as winstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston, { createLogger } from 'winston';
import { ZodValidationPipe } from 'nestjs-zod';
import compression from 'compression';
import { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { isDevelopment } from '@/common/utils/is-development';
import { getDocs } from '@/common/utils/startup-app/get-docs';

import { AppModule } from './app.module';


const logger = createLogger({
    transports: [ new winston.transports.Console() ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.align(),
        winstonModuleUtilities.format.nestLike('', {
            colors: true,
            prettyPrint: true,
            processId: false,
            appName: false,
        }),
    ),
    level: isDevelopment() ? 'debug' : 'info',
});

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });
    
    app.use(json({ limit: '1000mb' }));
    
    app.use(compression());
    
    // app.setGlobalPrefix(ROOT);
    
    const config = app.get(ConfigService);
    
    app.use(helmet());
    
    if (isDevelopment()) {
        app.use(morgan('short'));
    }
    
    app.useGlobalPipes(new ZodValidationPipe());
    
    
    await getDocs(app, config);
    
    await app.listen(Number(config.getOrThrow<string>('APP_PORT')))
        .then(() => {
            logger.info(
                `Server is running on http://localhost:${ config.getOrThrow<string>('APP_PORT') }`,
            );
        });
    
    app.enableShutdownHooks();
}

bootstrap();
