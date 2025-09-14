import { FileMigrationProvider, Migrator, PostgresDialect, CamelCasePlugin } from 'kysely';
import commandLineArgs from 'command-line-args';
import { promises as fs } from 'fs';
import { consola } from 'consola';
import { config } from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';

import { Database } from '@/database/database';

config({
    path: [
        path.resolve('.env'),
    ],
});
const migrationsPath = path.resolve('./src/database/migrations');
consola.log('MIGRATIONS_PATH', migrationsPath);

const options = commandLineArgs([
    { name: 'up', alias: 'u', type: Boolean },
    { name: 'down', alias: 'd', type: Boolean },
]);

consola.log('# Migrations started');

async function migrateToLatest() {
    
    const database = new Database({
        dialect: new PostgresDialect({
            pool: new Pool({
                host: process.env.POSTGRES_HOST,
                port: +process.env.POSTGRES_PORT!,
                database: process.env.POSTGRES_DB,
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                max: 10,
            }),
        }),
        plugins: [
            new CamelCasePlugin(),
        ],
    });
    const migrator = new Migrator({
        db: database,
        migrationTableName: '_migrations',
        migrationLockTableName: '_migrations_lock',
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: migrationsPath,
        }),
    });
    
    const migrations = await migrator.getMigrations();
    consola.log('# PENDING MIGRATIONS');
    consola.log(
        migrations
            .filter((i) => !i.executedAt)
            .map((i) => i.name),
    );
    switch (true) {
        case options.up: {
            const { error, results } = await migrator.migrateToLatest();
            
            results?.forEach((migrationResult) => {
                if (migrationResult.status === 'Success') {
                    consola.log(
                        `# EXECUTED: "${ migrationResult.migrationName }" successfully`,
                    );
                } else if (migrationResult.status === 'Error') {
                    consola.error(
                        `failed to execute migration "${ migrationResult.migrationName }"`,
                    );
                }
            });
            
            if (results?.length === 0) {
                consola.log('# No migrations to execute');
            }
            
            if (error) {
                consola.error('Failed to migrate');
                consola.error(error);
                process.exit(1);
            }
        }
            break;
        case options.down: {
            const { error, results } = await migrator.migrateDown();
            results?.forEach((migrationResult) => {
                if (migrationResult.status === 'Success') {
                    consola.log(
                        `DOWNGRADED: "${ migrationResult.migrationName }" successfully`,
                    );
                } else if (migrationResult.status === 'Error') {
                    consola.error(
                        `failed to downgrade migration "${ migrationResult.migrationName }"`,
                    );
                }
            });
            if (error) {
                consola.error('Failed to migrate');
                consola.error(error);
                process.exit(1);
            }
        }
            break;
        default:
            consola.log('# Waiting migrations');
            consola.log(await migrator.getMigrations());
            break;
    }
    
    await database.destroy();
}

migrateToLatest()
    .then(() => consola.log('# Exit...'));
