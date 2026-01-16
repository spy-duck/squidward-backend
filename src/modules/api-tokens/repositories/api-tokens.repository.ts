import { Injectable } from '@nestjs/common';

import { ApiTokensMapper } from '@/modules/api-tokens/mappers/api-tokens.mapper';
import { Database } from '@/database/database';

import { ApiTokenEntity } from '../entities/api-token.entity';


@Injectable()
export class ApiTokensRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async getByUuid(apiTokenUuid: string): Promise<ApiTokenEntity | null> {
        const apiToken = await this.db
            .selectFrom('apiTokens')
            .selectAll()
            .where('uuid', '=', apiTokenUuid)
            .executeTakeFirst();
        return apiToken ? ApiTokensMapper.toEntity(apiToken) : null;
    }
    
    async findExist(tokenName: string, excludeUuid?: string): Promise<ApiTokenEntity | null> {
        const apiToken = await this.db
            .selectFrom('apiTokens')
            .selectAll()
            .$if(!!excludeUuid, (wb) => wb.where('uuid', '!=', excludeUuid!))
            .where('tokenName', '=', tokenName)
            .executeTakeFirst();
        return apiToken ? ApiTokensMapper.toEntity(apiToken) : null;
    }
    
    async create(entity: ApiTokenEntity): Promise<ApiTokenEntity> {
        const apiToken = await this.db
            .insertInto('apiTokens')
            .values(ApiTokensMapper.toModelNew(entity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return ApiTokensMapper.toEntity(apiToken);
    }
    
    async update(entity: ApiTokenEntity): Promise<ApiTokenEntity> {
        const apiToken = await this.db
            .updateTable('apiTokens')
            .set(ApiTokensMapper.toModel(entity))
            .where('uuid', '=', entity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return ApiTokensMapper.toEntity(apiToken);
    }
    
    async getAll(): Promise<ApiTokenEntity[]> {
        const apiTokens = await this.db
            .selectFrom('apiTokens')
            .selectAll()
            .execute();
        return apiTokens.map(ApiTokensMapper.toEntity);
    }
    
    async delete(apiTokenUuid: string): Promise<void> {
        await this.db
            .deleteFrom('apiTokens')
            .where('uuid', '=', apiTokenUuid)
            .execute();
    }
}