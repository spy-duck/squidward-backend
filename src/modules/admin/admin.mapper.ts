import { AdminModelInsertable, AdminModelSelectable, AdminModelUpdateable } from '@/database/models/admin.model';

import { AdminEntity } from './entities/admin.entity';

export class AdminMapper {
    static toEntity = (model: AdminModelSelectable): AdminEntity => {
        return new AdminEntity(model)
    }
    
    static toModelNew = (entity: AdminEntity): AdminModelInsertable => {
        return {
            uuid: entity.uuid,
            username: entity.username,
            passwordHash: entity.passwordHash,
            role: entity.role,
        }
    }
    
    static toModel = (entity: AdminEntity): AdminModelUpdateable => {
        return entity;
    }
}