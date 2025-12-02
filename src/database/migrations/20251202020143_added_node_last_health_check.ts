/**
** added node lastCheckHealth - 2025-12-01T23:01:43.297Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .addColumn('lastCheckHealth', 'timestamp')
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .dropColumn('lastCheckHealth')
        .execute();
}
