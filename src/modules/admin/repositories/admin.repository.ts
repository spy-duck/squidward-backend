import { Injectable } from '@nestjs/common';

import { AdminMapper } from '@/modules/admin/admin.mapper';
import { Database } from '@/database/database';

import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async getByUsername(adminUsername: string): Promise<AdminEntity | null> {
        const admin = await this.db
            .selectFrom('admins')
            .selectAll()
            .where('username', '=', adminUsername)
            .executeTakeFirst();
        return admin ? AdminMapper.toEntity(admin) : null;
    }
}