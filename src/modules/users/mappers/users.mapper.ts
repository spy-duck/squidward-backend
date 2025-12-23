import {
    UserModelInsertable,
    UserModelSelectable,
    UserModelUpdateable, UserRelations,
} from '@/database/models';
import { UserMetricsMapper } from '@/modules/users/mappers';

import { UserEntity } from '../entities/user.entity';

export class UsersMapper {
    static toEntity = (model: UserModelSelectable & UserRelations): UserEntity => {
        return new UserEntity({
            uuid: model.uuid,
            name: model.name,
            username: model.username,
            password: model.password,
            status: model.status,
            email: model.email,
            telegramId: model.telegramId ? +model.telegramId : model.telegramId,
            usedTrafficBytes: model.usedTrafficBytes,
            firstConnectedAt: model.firstConnectedAt,
            expireAt: model.expireAt,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            
            metrics: model.metrics ? UserMetricsMapper.toEntity(model.metrics) : null,
        })
    }
    
    static toModelNew = (entity: UserEntity): UserModelInsertable => {
        return {
            uuid: entity.uuid,
            name: entity.name,
            username: entity.username,
            password: entity.password,
            status: entity.status,
            email: entity.email,
            telegramId: entity.telegramId,
            usedTrafficBytes: entity.usedTrafficBytes,
            firstConnectedAt: entity.firstConnectedAt,
            expireAt: entity.expireAt,
        }
    }
    
    static toModel = (entity: UserEntity): UserModelUpdateable => {
        return {
            uuid: entity.uuid,
            name: entity.name,
            username: entity.username,
            password: entity.password,
            status: entity.status,
            email: entity.email,
            telegramId: entity.telegramId,
            usedTrafficBytes: entity.usedTrafficBytes,
            firstConnectedAt: entity.firstConnectedAt,
            expireAt: entity.expireAt,
            updatedAt: entity.updatedAt,
        };
    }
}