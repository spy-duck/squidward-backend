/**
** added configs - 2025-09-15T20:39:34.170+03:00
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely, sql } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    
    await database.schema
        .createTable('configs')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(255)', col => col.notNull())
        .addColumn('config', 'text', col => col.notNull())
        .addColumn('version', 'varchar(255)', col => col.notNull())
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('configs')
        .execute();
}
