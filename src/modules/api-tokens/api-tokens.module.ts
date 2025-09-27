import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ApiTokensRepository } from './repositories/api-tokens.repository';
import { ApiTokensController } from './api-tokens.controller';
import { ApiTokensService } from './api-tokens.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ ConfigModule ],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('JWT_AUTH_SECRET'),
            }),
            inject: [ ConfigService ],
        }),
    ],
    controllers: [ ApiTokensController ],
    providers: [ ApiTokensRepository, ApiTokensService ],
})
export class ApiTokensModule {}