import { Injectable } from '@nestjs/common';

import { sql } from 'kysely';

import { UserMetricsEntity } from '@/modules/users/entities';
import { UserMetricsMapper } from '@/modules/users/mappers';
import { Database } from '@/database/database';


@Injectable()
export class UsersMetricsRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async save(entities: UserMetricsEntity[]): Promise<void> {
        await this.db
            .insertInto('usersMetrics')
            .values(entities.map(UserMetricsMapper.toModel))
            .onConflict((cf) => cf
                .columns([ 'userUuid', 'nodeUuid' ])
                .doUpdateSet({
                    upload: sql`users_metrics.upload + EXCLUDED.upload`,
                    download: sql`users_metrics.download + EXCLUDED.download`,
                    total: sql`users_metrics.total + EXCLUDED.total`,
                }),
            )
            .executeTakeFirstOrThrow();
    }
    
    async resetUserMetrics(userUuid: string): Promise<void> {
        await this.db
            .updateTable('usersMetrics')
            .set({
                upload: 0,
                download: 0,
                total: 0,
            })
            .where('userUuid', '=', userUuid)
            .execute();
    }
}
