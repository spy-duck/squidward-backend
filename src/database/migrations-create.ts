import * as readline from 'node:readline/promises';
import commandLineArgs from 'command-line-args';
import * as process from 'node:process';
import { snakeCase } from 'lodash-es';
import fs from 'node:fs/promises';
import { DateTime } from 'luxon';
import consola from 'consola';
import path from 'path';

function makeMigrationTemplate(migrationName: string, now: DateTime) {
    return `/**
** ${ migrationName } - ${ now.toISO() }
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema;
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema;
}
`;
}
const options = commandLineArgs([
    { name: 'name', alias: 'n', type: String },
]) as {
    name: string
};

async function main() {
    let name: string = options.name;
    if (!name) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        name = await rl.question("Enter migration name:");
    }

    if (!name) {
        consola.error('Migration name is required');
        process.exit(9);
        return;
    }

    const now = DateTime.now();
    const dir = path.resolve('./src/database/migrations');
    const migrationName = `${ now.toFormat('yyyyMMddHHmmss') }_${snakeCase(name)}.ts`;
    const fullMigrationPath = path.join(dir, migrationName);
    await fs.writeFile(fullMigrationPath, makeMigrationTemplate(name, now));
    return fullMigrationPath;
}

main()
    .then((fullMigrationPath: string | undefined) => {
        consola.log(`# Migration created: ${ fullMigrationPath }`);
        process.exit(0);
    });
