/**
 ** added certs - 2025-09-23T15:13:47.559Z
 ** [Docs: https://kysely.dev/docs/migrations]
 **/
import { Kysely, sql } from 'kysely';

import { generateJwtKeypair, generateMasterCerts } from '@/common/utils/keygen';
import { TDatabase } from '@/database/database';

export async function up(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .createTable('certs')
        .addColumn('uuid', 'uuid', col => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('caCertPem', 'text', col => col.notNull())
        .addColumn('caKeyPem', 'text', col => col.notNull())
        .addColumn('clientCertPem', 'text', col => col.notNull())
        .addColumn('clientKeyPem', 'text', col => col.notNull())
        .addColumn('publicKey', 'text', col => col.notNull())
        .addColumn('privateKey', 'text', col => col.notNull())
        .addColumn('createdAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .addColumn('updatedAt', 'timestamp', col => col.notNull().defaultTo(sql`now()`))
        .execute();
    
    const { publicKey, privateKey } = await generateJwtKeypair();
    const { caCertPem, caKeyPem, clientCertPem, clientKeyPem } = await generateMasterCerts();
    
    await database
        .insertInto('certs')
        .values({
            publicKey,
            privateKey,
            caCertPem,
            caKeyPem,
            clientCertPem,
            clientKeyPem,
        })
        .execute();
}

export async function down(database: Kysely<TDatabase>): Promise<void> {
    await database.schema
        .dropTable('certs')
        .execute();
}
