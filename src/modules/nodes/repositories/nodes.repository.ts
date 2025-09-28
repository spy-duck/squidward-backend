import { Injectable } from '@nestjs/common';

import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { NodeEntity } from '@/modules/nodes/entities/node.entity';
import { NODE_STATE } from '@contract/constants';
import { Database } from '@/database/database';

import { NodesMapper } from '../nodes.mapper';

@Injectable()
export class NodesRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async create(nodeEntity: NodeEntity): Promise<NodeEntity> {
        const node = await this.db
            .insertInto('nodes')
            .values(NodesMapper.toModelNew(nodeEntity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return NodesMapper.toEntity(node);
    }
    
    async getAll(): Promise<NodeEntity[]> {
        const nodes = await this.db
            .selectFrom('nodes')
            .selectAll()
            .select([
                (sb) => jsonObjectFrom(
                    sb.selectFrom('configs')
                        .select([
                            'name',
                        ])
                        .whereRef('configs.uuid', '=', 'nodes.configId'),
                ).as('config'),
            ])
            .orderBy('name')
            .execute();
        return nodes.map(NodesMapper.toEntity);
    }
    
    async getAllActive(): Promise<NodeEntity[]> {
        const nodes = await this.db
            .selectFrom('nodes')
            .selectAll()
            .select([
                (sb) => jsonObjectFrom(
                    sb.selectFrom('configs')
                        .select([
                            'name',
                        ])
                        .whereRef('configs.uuid', '=', 'nodes.configId'),
                ).as('config'),
            ])
            .where('isConnected', '=', true)
            .where('state', '=', NODE_STATE.RUNNING)
            .orderBy('name')
            .execute();
        return nodes.map(NodesMapper.toEntity);
    }
    
    async getByUuid(nodeUuid: string): Promise<NodeEntity | null> {
        const node = await this.db
            .selectFrom('nodes')
            .selectAll()
            .select([
                (sb) => jsonObjectFrom(
                    sb.selectFrom('configs')
                        .select([
                            'name',
                        ])
                        .whereRef('configs.uuid', '=', 'nodes.configId'),
                ).as('config'),
            ])
            .where('uuid', '=', nodeUuid)
            .executeTakeFirst();
        return node ? NodesMapper.toEntity(node) : null;
    }
    
    async delete(nodeUuid: string): Promise<void> {
        await this.db
            .deleteFrom('nodes')
            .where('uuid', '=', nodeUuid)
            .execute();
    }
    
    async update(nodeEntity: NodeEntity): Promise<NodeEntity> {
        const node = await this.db
            .updateTable('nodes')
            .set(NodesMapper.toModel({
                ...nodeEntity,
                updatedAt: new Date(),
            }))
            .where('uuid', '=', nodeEntity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return NodesMapper.toEntity(node);
    }
    
    async findExist(
        name: string,
        host: string,
        excludeUuid?: string,
    ): Promise<NodeEntity | null> {
        const node = await this.db
            .selectFrom('nodes')
            .selectAll()
            .$if(!!excludeUuid, (wb) => wb.where('uuid', '!=', excludeUuid!))
            .where((wb) => wb.or([
                wb('name', '=', name),
                wb('host', '=', host),
            ]))
            .executeTakeFirst();
        return node ? NodesMapper.toEntity(node) : null;
    }
}