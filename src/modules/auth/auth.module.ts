import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ApiTokensRepository } from '@/modules/api-tokens/repositories/api-tokens.repository';
import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { JwtStrategy } from '@/common/guards/jwt/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    controllers: [ AuthController ],
    providers: [ AdminRepository, ApiTokensRepository, JwtStrategy, AuthService ],
})
export class AuthModule {}
