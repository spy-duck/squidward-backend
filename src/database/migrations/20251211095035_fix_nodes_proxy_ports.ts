/**
** fix_nodes_proxy_ports - 2025-12-11T06:50:35.563Z
** [Docs: https://kysely.dev/docs/migrations]
**/
import { Kysely } from 'kysely';

import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database
        .updateTable('nodes')
        .set({
            httpPort: 10498,
            httpsEnabled: true,
            httpsPort: 3129,
        })
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database
        .updateTable('nodes')
        .set({
            httpPort: undefined,
            httpsEnabled: null,
            httpsPort: null,
        })
        .execute();
}
