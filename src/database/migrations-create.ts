import commandLineArgs from 'command-line-args';
import * as process from 'node:process';
import { snakeCase } from 'lodash-es';
import fs from 'node:fs/promises';
import consola from 'consola';
import dayjs from 'dayjs';
import path from 'path';

function makeMigrationTemplate(migrationName: string, now: dayjs.Dayjs) {
    return `/**
** ${ migrationName } - ${ now.toISOString() }
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
        name = await consola.prompt("Enter migration name:", {
            type: 'text',
        });
    }

    if (!name) {
        consola.error('Migration name is required');
        process.exit(9);
        return;
    }

    const now = dayjs();
    const dir = path.resolve('./src/database/migrations');
    const migrationName = `${ now.format('YYYYMMDDHHmmss') }_${snakeCase(name)}.ts`;
    const fullMigrationPath = path.join(dir, migrationName);
    await fs.writeFile(fullMigrationPath, makeMigrationTemplate(name, now));
    return fullMigrationPath;
}

main()
    .then((fullMigrationPath: string | undefined) => {
        consola.box(`Migration created: ${ fullMigrationPath }`);
        process.exit(0);
    });
