import { Injectable } from '@nestjs/common';

import { sql } from 'kysely';

import { NodeMetricsEntity } from '@/modules/nodes/entities';
import { NodeMetricsMapper } from '@/modules/nodes/mappers';
import { Database } from '@/database/database';


@Injectable()
export class NodesMetricsRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async save(entity: NodeMetricsEntity): Promise<void> {
        await this.db
            .insertInto('nodesMetrics')
            .values(NodeMetricsMapper.toModel(entity))
            .onConflict((cf) => cf
                .columns([ 'nodeUuid' ])
                .doUpdateSet({
                    upload: sql`nodes_metrics.upload + EXCLUDED.upload`,
                    download: sql`nodes_metrics.download + EXCLUDED.download`,
                    total: sql`nodes_metrics.total + EXCLUDED.total`,
                }),
            )
            .executeTakeFirstOrThrow();
    }
    
}
