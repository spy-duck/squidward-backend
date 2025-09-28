import { Injectable } from '@nestjs/common';

import { Database } from '@/database/database';

import { HostEntity } from '../entities/host.entity';
import { HostsMapper } from '../hosts.mapper';


@Injectable()
export class HostsRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async getByUuid(apiTokenUuid: string): Promise<HostEntity | null> {
        const host = await this.db
            .selectFrom('hosts')
            .selectAll()
            .where('uuid', '=', apiTokenUuid)
            .executeTakeFirst();
        return host ? HostsMapper.toEntity(host) : null;
    }
    
    async findExist(
        hostName: string,
        excludeUuid?: string,
    ): Promise<HostEntity | null> {
        const host = await this.db
            .selectFrom('hosts')
            .selectAll()
            .$if(!!excludeUuid, (wb) => wb.where('uuid', '!=', excludeUuid!))
            .where('name', '=', hostName)
            .executeTakeFirst();
        return host ? HostsMapper.toEntity(host) : null;
    }
    
    async create(entity: HostEntity): Promise<HostEntity> {
        const host = await this.db
            .insertInto('hosts')
            .values(HostsMapper.toModelNew(entity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return HostsMapper.toEntity(host);
    }
    
    async update(entity: HostEntity): Promise<HostEntity> {
        const host = await this.db
            .updateTable('hosts')
            .set(HostsMapper.toModel(entity))
            .where('uuid', '=', entity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return HostsMapper.toEntity(host);
    }
    
    async getAll(): Promise<HostEntity[]> {
        const hosts = await this.db
            .selectFrom('hosts')
            .selectAll()
            .execute();
        return hosts.map(HostsMapper.toEntity);
    }
    
    async delete(hostUuid: string): Promise<void> {
        await this.db
            .deleteFrom('hosts')
            .where('uuid', '=', hostUuid)
            .execute();
    }
}