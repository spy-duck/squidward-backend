/**
** added metrics - 2025-12-24T06:32:10.986Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('usersMetrics')
        .addColumn('userUuid', 'uuid', (col) => col
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
        .addPrimaryKeyConstraint('pk_usersMetrics', ['userUuid', 'nodeUuid'])
        .execute();
    
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
    
    await database.schema
        .dropTable('usersMetrics')
        .execute();
}
