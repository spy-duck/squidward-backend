import {
    UserMetricsModelInsertable,
    UserMetricsModelSelectable,
} from '@/database/models';
import { UserMetricsEntity } from '@/modules/users/entities';


export class UserMetricsMapper {
    static toEntity = (model: Partial<UserMetricsModelSelectable>): UserMetricsEntity => {
        return new UserMetricsEntity({
            userUuid: model.userUuid,
            nodeUuid: model.userUuid,
            upload: BigInt(model.upload || 0),
            download: BigInt(model.download || 0),
            total: BigInt(model.total || 0),
        })
    }
    
    static toModel = (entity: UserMetricsEntity): UserMetricsModelInsertable => {
        return {
            userUuid: entity.userUuid,
            nodeUuid: entity.userUuid,
            upload: Number(entity.upload),
            download: Number(entity.download),
            total: Number(entity.total),
        };
    }
}