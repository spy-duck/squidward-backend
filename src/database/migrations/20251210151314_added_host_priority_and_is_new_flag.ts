/**
** added host priority and isNew flag - 2025-12-10T12:13:14.249Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('hosts')
        .addColumn('priority', 'integer', (col) => col.notNull().defaultTo(0))
        .addColumn('isNew', 'boolean', col => col.notNull().defaultTo(false))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('hosts')
        .dropColumn('priority')
        .dropColumn('isNew')
        .execute();
}
