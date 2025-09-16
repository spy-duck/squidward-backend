/**
 ** initial_migration - 2025-09-11T15:54:58.466+03:00
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
    
    await database.schema
        .createTable('nodes')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(255)', col => col.notNull())
        .addColumn('host', 'varchar(255)', col => col.notNull())
        .addColumn('port', 'integer', col => col.notNull())
        .addColumn('configId', 'uuid', col =>
            col.notNull()
                .references('configs.uuid')
                .onDelete('restrict')
                .onUpdate('restrict'),
        )
        .addColumn('description', 'text')
        .addColumn('isConnected', 'boolean', col => col.notNull().defaultTo(false))
        .addColumn('state', 'varchar(255)', col => col.notNull().defaultTo(false))
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('lastConnectedAt', 'timestamp')
        .addColumn('lastOnlineAt', 'timestamp')
        .execute();
    
    await database.schema
        .createTable('users')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
         .addColumn('name', 'varchar(255)', col => col.notNull())
         .addColumn('username', 'varchar(255)', col => col.notNull())
         .addColumn('password', 'varchar(255)', col => col.notNull())
         .addColumn('status', 'varchar(255)', col => col.notNull())
         .addColumn('email', 'varchar(255)')
         .addColumn('telegramId', 'bigint')
         .addColumn('usedTrafficBytes', 'bigint')
         .addColumn('firstConnectedAt', 'timestamp')
         .addColumn('expireAt', 'timestamp', col => col.notNull())
         .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
         .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('users')
        .execute();
    await database.schema
        .dropTable('nodes')
        .execute();
    await database.schema
        .dropTable('configs')
        .execute();
}
