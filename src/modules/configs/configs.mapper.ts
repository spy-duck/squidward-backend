import {
    ConfigModelInsertable,
    ConfigModelSelectable,
    ConfigModelUpdateable,
} from '@/database/models';
import { isDefined } from '@/common/utils/is-defined';

import { ConfigEntity } from './entities/config.entity';

export class ConfigsMapper {
    static toEntity = (model: ConfigModelSelectable): ConfigEntity => {
        return new ConfigEntity({
            uuid: model.uuid,
            name: model.name,
            config: model.config,
            version: model.version,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            nodesCount: isDefined(model.nodesCount) ? +model.nodesCount : null,
        })
    }
    
    static toModelNew = (entity: ConfigEntity): ConfigModelInsertable => {
        return {
            name: entity.name,
            config: entity.config,
            version: entity.version,
        }
    }
    
    static toModel = (entity: ConfigEntity): ConfigModelUpdateable => {
        return entity;
    }
}