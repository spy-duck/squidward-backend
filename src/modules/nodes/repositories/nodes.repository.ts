import { Injectable } from '@nestjs/common';

import { NodeEntity } from '@/modules/nodes/entities/node.entity';
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
    
    async getById(nodeUuid: string): Promise<NodeEntity | null> {
        const node = await this.db
            .selectFrom('nodes')
            .selectAll()
            .where('uuid', '=', nodeUuid)
            .executeTakeFirst();
        return node ? NodesMapper.toEntity(node) : null;
    }
    
    async getAll(): Promise<NodeEntity[]> {
        const nodes = await this.db
            .selectFrom('nodes')
            .selectAll()
            .execute();
        return nodes.map(NodesMapper.toEntity);
    }
    
    async getEnabledList(): Promise<NodeEntity[]> {
        const nodes = await this.db
            .selectFrom('nodes')
            .selectAll()
            .where('isEnabled', '=', true)
            .execute();
        return nodes.map(NodesMapper.toEntity);
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
            .set(NodesMapper.toModel(nodeEntity))
            .where('uuid', '=', nodeEntity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return NodesMapper.toEntity(node);
    }
}