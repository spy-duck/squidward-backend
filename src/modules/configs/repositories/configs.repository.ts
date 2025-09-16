import { Injectable } from '@nestjs/common';

import { sql } from 'kysely';

import { Database } from '@/database/database';

import { ConfigEntity } from '../entities/config.entity';
import { ConfigsMapper } from '../configs.mapper';

@Injectable()
export class ConfigsRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async create(configEntity: ConfigEntity): Promise<ConfigEntity> {
        const config = await this.db
            .insertInto('configs')
            .values(ConfigsMapper.toModelNew(configEntity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return ConfigsMapper.toEntity(config);
    }
    
    async getAll(): Promise<ConfigEntity[]> {
        const configs = await this.db
            .selectFrom('configs')
            .selectAll()
            .select([
                (sb) => sb
                    .selectFrom('nodes')
                    .select(sql<number>`count(*)`.as('nodesCount'))
                    .whereRef('nodes.configId', '=', 'configs.uuid')
                    .as('nodesCount'),
            ])
            .orderBy('name')
            .execute();
        return configs.map(ConfigsMapper.toEntity);
    }
    
    async delete(configUuid: string): Promise<void> {
        await this.db
            .deleteFrom('configs')
            .where('uuid', '=', configUuid)
            .execute();
    }
    
    async update(configEntity: ConfigEntity): Promise<ConfigEntity> {
        const config = await this.db
            .updateTable('configs')
            .set(ConfigsMapper.toModel(configEntity))
            .where('uuid', '=', configEntity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return ConfigsMapper.toEntity(config);
    }
    
    async getOne(configUuid: string): Promise<ConfigEntity | null> {
        const config = await this.db
            .selectFrom('configs')
            .selectAll()
            .select([
                (sb) => sb
                    .selectFrom('nodes')
                    .select(sql<number>`count(*)`.as('nodesCount'))
                    .whereRef('nodes.configId', '=', 'configs.uuid')
                    .as('nodesCount'),
            ])
            .where('uuid', '=', configUuid)
            .executeTakeFirst();
        return config ? ConfigsMapper.toEntity(config) : null;
    }
}