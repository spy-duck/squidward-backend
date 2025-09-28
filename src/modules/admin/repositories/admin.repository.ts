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
    
    async getByUuid(adminUuid: string): Promise<AdminEntity | null> {
        const admin = await this.db
            .selectFrom('admins')
            .selectAll()
            .where('uuid', '=', adminUuid)
            .executeTakeFirst();
        return admin ? AdminMapper.toEntity(admin) : null;
    }
    
    async changeCredentials(entity: AdminEntity): Promise<AdminEntity | null> {
        const admin = await this.db
            .updateTable('admins')
            .set(AdminMapper.toModel({
                ...entity,
                updatedAt: new Date(),
            }))
            .where('uuid', '=', entity.uuid)
            .returningAll()
            .executeTakeFirst();
        return admin ? AdminMapper.toEntity(admin) : null;
    }
}