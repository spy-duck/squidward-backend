/**
** added store node version - 2025-12-02T21:22:29.447Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .addColumn('version', 'varchar(255)')
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .dropColumn('version')
        .execute();
}
