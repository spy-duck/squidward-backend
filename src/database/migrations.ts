import { FileMigrationProvider, Migrator, PostgresDialect, CamelCasePlugin } from 'kysely';
import commandLineArgs from 'command-line-args';
import { Database } from '@/database/database';
import { promises as fs } from 'fs';
import { config } from 'dotenv';
import * as path from 'path';
import { Pool } from 'pg';

config({
    path: [
        path.resolve('.env'),
    ],
});
const migrationsPath = path.resolve('./src/database/migrations');
console.log('MIGRATIONS_PATH', migrationsPath);

const options = commandLineArgs([
    { name: 'up', alias: 'u', type: Boolean },
    { name: 'down', alias: 'd', type: Boolean },
]);

console.log('# Migrations started');

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
    console.log('# PENDING MIGRATIONS');
    console.log(
        migrations
            .filter((i) => !i.executedAt)
            .map((i) => i.name),
    );
    switch (true) {
        case options.up: {
            const { error, results } = await migrator.migrateToLatest();
            
            results?.forEach((migrationResult) => {
                if (migrationResult.status === 'Success') {
                    console.log(
                        `# EXECUTED: "${ migrationResult.migrationName }" successfully`,
                    );
                } else if (migrationResult.status === 'Error') {
                    console.error(
                        `failed to execute migration "${ migrationResult.migrationName }"`,
                    );
                }
            });
            
            if (results?.length === 0) {
                console.log('# No migrations to execute');
            }
            
            if (error) {
                console.error('Failed to migrate');
                console.error(error);
                process.exit(1);
            }
        }
            break;
        case options.down: {
            const { error, results } = await migrator.migrateDown();
            results?.forEach((migrationResult) => {
                if (migrationResult.status === 'Success') {
                    console.log(
                        `DOWNGRADED: "${ migrationResult.migrationName }" successfully`,
                    );
                } else if (migrationResult.status === 'Error') {
                    console.error(
                        `failed to downgrade migration "${ migrationResult.migrationName }"`,
                    );
                }
            });
            if (error) {
                console.error('Failed to migrate');
                console.error(error);
                process.exit(1);
            }
        }
            break;
        default:
            console.log('# Waiting migrations');
            console.log(await migrator.getMigrations());
            break;
    }
    
    await database.destroy();
}

migrateToLatest()
    .then(() => console.log('# Exit...'));
