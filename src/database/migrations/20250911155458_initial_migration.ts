/**
 ** initial_migration - 2025-09-11T15:54:58.466+03:00
 ** [Docs: https://kysely.dev/docs/migrations]
 **/
import { Kysely, sql } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('nodes')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(255)', col => col.notNull())
        .addColumn('host', 'varchar(255)', col => col.notNull())
        .addColumn('port', 'integer', col => col.notNull())
        .addColumn('description', 'text')
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('nodes')
        .execute();
}
