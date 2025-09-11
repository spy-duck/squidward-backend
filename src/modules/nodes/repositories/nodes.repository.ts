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
            .values(NodesMapper.toModel(nodeEntity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return NodesMapper.toEntity(node);
    }
    
    async getById(nodeId: string): Promise<NodeEntity | null> {
        const node = await this.db
            .selectFrom('nodes')
            .selectAll()
            .where('id', '=', nodeId)
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
    
    async delete(nodeId: string): Promise<void> {
        await this.db
            .deleteFrom('nodes')
            .where('id', '=', nodeId)
            .execute();
    }
    
    async update(nodeEntity: NodeEntity): Promise<NodeEntity> {
        const node = await this.db
            .updateTable('nodes')
            .set(NodesMapper.toModel(nodeEntity))
            .where('id', '=', nodeEntity.id)
            .returningAll()
            .executeTakeFirstOrThrow();
        return NodesMapper.toEntity(node);
    }
}