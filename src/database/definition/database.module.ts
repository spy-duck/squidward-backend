import { CamelCasePlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { Global, Module } from '@nestjs/common';

import {
    ConfigurableDatabaseModule,
    DATABASE_OPTIONS,
    DatabaseOptions,
} from './database.module-definition';
import { Database } from '../database';


@Global()
@Module({
    exports: [ Database ],
    providers: [
        {
            provide: Database,
            inject: [ DATABASE_OPTIONS ],
            useFactory: (
                options: DatabaseOptions
            ): Database => new Database({
                dialect: new PostgresDialect({
                    pool: new Pool({
                        host: options.host,
                        port: options.port,
                        database: options.database,
                        user: options.user,
                        password: options.password,
                        max: 10,
                    }),
                }),
                plugins: [
                    new CamelCasePlugin(),
                ],
            }),
        },
    ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
