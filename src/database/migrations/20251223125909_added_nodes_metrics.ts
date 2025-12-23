/**
** added nodes metrics - 2025-12-23T09:59:09.056Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('nodesMetrics')
        .addColumn('nodeUuid', 'uuid', (col) => col
            .primaryKey()
            .references('nodes.uuid')
            .onDelete('restrict')
            .onUpdate('restrict')
            .notNull()
        )
        .addColumn('download', 'bigint', col => col.defaultTo(0))
        .addColumn('upload', 'bigint', col => col.defaultTo(0))
        .addColumn('total', 'bigint', col => col.defaultTo(0))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('nodesMetrics')
        .execute();
}