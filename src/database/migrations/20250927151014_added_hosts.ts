/**
 ** Added hosts - 2025-09-27T12:10:14.883Z
 ** [Docs: https://kysely.dev/docs/migrations]
 **/
import { Kysely, sql } from 'kysely';

import { TDatabase } from '../database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('hosts')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(255)', col => col.notNull())
        .addColumn('url', 'varchar(255)', col => col.notNull())
        .addColumn('countryCode', 'varchar(2)', col => col.notNull())
        .addColumn('nodeId', 'uuid', col => col
            .notNull()
            .references('nodes.uuid')
            .onDelete('restrict')
            .onUpdate('restrict'),
        )
        .addColumn('enabled', 'boolean', col => col
            .notNull()
            .defaultTo(false)
        )
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('hosts')
        .execute();
}
