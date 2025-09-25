import { Injectable } from '@nestjs/common';

import { ApiMapper } from '@/modules/api/api.mapper';
import { Database } from '@/database/database';

import { ApiEntity } from '../entities/api.entity';

@Injectable()
export class ApiRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async getByUuid(userUuid: string): Promise<ApiEntity | null> {
        const apiToken = await this.db
            .selectFrom('apiTokens')
            .selectAll()
            .where('uuid', '=', userUuid)
            .executeTakeFirst();
        return apiToken ? ApiMapper.toEntity(apiToken) : null;
    }
}