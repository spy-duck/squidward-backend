import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { ApiRepository } from '@/modules/api/repositories/api.repository';
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
    providers: [ AdminRepository, ApiRepository, JwtStrategy, AuthService ],
})
export class AuthModule {}
