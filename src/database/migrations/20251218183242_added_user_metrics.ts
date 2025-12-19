/**
** added user metrics - 2025-12-18T15:32:42.920Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('usersMetrics')
        .addColumn('userUuid', 'uuid', (col) => col
            .primaryKey()
            .references('users.uuid')
            .onDelete('restrict')
            .onUpdate('restrict')
        )
        .addColumn('nodeUuid', 'uuid', (col) => col
            .references('nodes.uuid')
            .onDelete('restrict')
            .onUpdate('restrict')
            .notNull()
        )
        .addColumn('download', 'bigint', col => col.defaultTo(0))
        .addColumn('upload', 'bigint', col => col.defaultTo(0))
        .addColumn('total', 'bigint', col => col.defaultTo(0))
        .execute();

    await database.schema
        .createIndex('ix_usersMetrics')
        .on('usersMetrics')
        .columns([
            'userUuid',
            'nodeUuid'
        ])
        .unique()
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('usersMetrics')
        .execute();
}
