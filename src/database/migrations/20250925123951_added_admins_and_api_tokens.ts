/**
 ** added admins and api tokens - 2025-09-25T09:39:51.903Z
 ** [Docs: https://kysely.dev/docs/migrations]
 **/
import { Kysely, sql } from 'kysely';
import dotenv from 'dotenv';

dotenv.config();

import { encryptPassword } from '@/common/helpers';
import { TDatabase } from '@/database/database';
import { ROLE } from '@contract/constants';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('admins')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('username', 'varchar(255)', col => col.notNull())
        .addColumn('passwordHash', 'varchar(255)', col => col.notNull())
        .addColumn('role', 'varchar(255)', col => col.notNull())
        .addColumn('isInitialPasswordChanged', 'boolean', col => col.notNull().defaultTo(false))
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
    
    await database
        .insertInto('admins')
        .values({
            username: 'squidward',
            passwordHash: await encryptPassword('squidward'),
            role: ROLE.ADMIN,
            isInitialPasswordChanged: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        .execute();
    
    await database.schema
        .createTable('apiTokens')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('token', 'varchar(255)', col => col.notNull())
        .addColumn('tokenName', 'varchar(255)', col => col.notNull())
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('apiTokens')
        .execute();
    await database.schema
        .dropTable('admins')
        .execute();
}
