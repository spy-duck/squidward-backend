import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ZodValidationPipe } from 'nestjs-zod';
import { WinstonModule } from 'nest-winston';
import compression from 'compression';
import { json } from 'express';
// import helmet from 'helmet';
import morgan from 'morgan';

import { getRealIpMiddleware, noRabotsMiddleware, proxyCheckMiddleware } from '@/common/middlewares';
import { getLogger, initDocs, isDevelopment } from '@/common/setup-app';

import { AppModule } from './app.module';


const logger = getLogger('Backend');

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            instance: logger,
        }),
    });
    
    app.use(json({ limit: '1000mb' }));
    
    app.use(compression());
    
    app.use(getRealIpMiddleware(), noRabotsMiddleware, proxyCheckMiddleware);
    
    const config = app.get(ConfigService);
    
    // app.use(helmet());
    
    if (isDevelopment()) {
        app.use(morgan(
            ':remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
        ));
    }
    
    
    await initDocs(app, config);
    
    app.enableCors({
        origin: isDevelopment() ? '*' : config.getOrThrow<string>('FRONT_END_DOMAIN'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: false,
    });
    
    app.useGlobalPipes(new ZodValidationPipe());
    
    app.enableShutdownHooks();
    
    await app.listen(+config.getOrThrow<string>('APP_PORT'))
        .then(() => {
            logger.info(
                `Server is running on http://localhost:${ config.getOrThrow<string>('APP_PORT') }`,
            );
        });
}

bootstrap();
