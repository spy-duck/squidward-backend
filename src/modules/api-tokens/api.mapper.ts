import {
    ApiTokenModelInsertable,
    ApiTokenModelSelectable,
    ApiTokenModelUpdateable,
} from '@/database/models';

import { ApiEntity } from './entities/api.entity';

export class ApiMapper {
    static toEntity = (model: ApiTokenModelSelectable): ApiEntity => {
        return new ApiEntity(model)
    }
    
    static toModelNew = (entity: ApiEntity): ApiTokenModelInsertable => {
        return {
            uuid: entity.uuid,
            token: entity.token,
            tokenName: entity.tokenName,
        }
    }
    
    static toModel = (entity: ApiEntity): ApiTokenModelUpdateable => {
        return entity;
    }
}