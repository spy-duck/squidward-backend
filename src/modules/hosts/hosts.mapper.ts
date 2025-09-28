import {
    HostModelInsertable,
    HostModelSelectable,
    HostModelUpdateable,
} from '@/database/models';

import { HostEntity } from './entities/host.entity';

export class HostsMapper {
    static toEntity = (model: HostModelSelectable): HostEntity => {
        return new HostEntity(model)
    }
    
    static toModelNew = (entity: HostEntity): HostModelInsertable => {
        return entity
    }
    
    static toModel = (entity: HostEntity): HostModelUpdateable => {
        return entity;
    }
}