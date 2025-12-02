/**
 ** added node country and isStarted flag - 2025-10-06T13:09:07.598Z
 ** [Docs: https://kysely.dev/docs/migrations]
 **/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .addColumn('isStarted', 'boolean', col => col.defaultTo(false))
        .addColumn('countryCode', 'varchar(2)', col => col
            .notNull()
            .defaultTo('XX')
        )
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .dropColumn('countryCode')
        .dropColumn('isStarted')
        .execute();
}
