/**
** added node proxy settings - 2025-12-10T13:30:19.148Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .addColumn('httpPort', 'integer')
        .addColumn('httpsEnabled', 'boolean')
        .addColumn('httpsPort', 'integer')
        .addColumn('speedLimitEnabled', 'boolean')
        .addColumn('speedLimit', 'integer')
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .alterTable('nodes')
        .dropColumn('httpsEnabled')
        .dropColumn('httpPort')
        .dropColumn('httpsPort')
        .dropColumn('speedLimitEnabled')
        .dropColumn('speedLimit')
        .execute();
}
