import {
    ApiTokenModelInsertable,
    ApiTokenModelSelectable,
    ApiTokenModelUpdateable,
} from '@/database/models';

import { ApiTokenEntity } from './entities/api-token.entity';

export class ApiTokensMapper {
    static toEntity = (model: ApiTokenModelSelectable): ApiTokenEntity => {
        return new ApiTokenEntity(model)
    }
    
    static toModelNew = (entity: ApiTokenEntity): ApiTokenModelInsertable => {
        return entity
    }
    
    static toModel = (entity: ApiTokenEntity): ApiTokenModelUpdateable => {
        return entity;
    }
}