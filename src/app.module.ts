import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { createKeyv } from '@keyv/redis';

import { DatabaseOptions } from '@/database/definition/database.module-definition';
import { SquidwardBackendModules } from '@/modules/squidward-backend.modules';
import { DatabaseModule } from '@/database/definition/database.module';
import { RolesGuard } from '@/common/guards/roles /roles.guard';
import { QueuesModule } from '@/queues/queues.module';
import { JwtGuard } from '@/common/guards/jwt';

import { AppService } from './app.service';

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
      CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          isGlobal: true,
          useFactory: async (configService: ConfigService) => {
              return {
                  stores: [
                      createKeyv(
                          {
                              url: `redis://${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<number>('REDIS_PORT')}`,
                              database: configService.getOrThrow<number>('REDIS_DB'),
                              password: configService.get<string | undefined>('REDIS_PASSWORD'),
                          },
                          {
                              namespace: 'squidward',
                              keyPrefixSeparator: ':',
                          },
                      ),
                  ],
              };
          },
      }),
      QueuesModule,
      SquidwardBackendModules,
  ],
  controllers: [],
  providers: [
      {
          provide: APP_GUARD,
          useClass: JwtGuard,
      },
      {
          provide: APP_GUARD,
          useClass: RolesGuard,
      },
      AppService,
  ],
})
export class AppModule {}
