import { NodeEntityInsertable, NodeEntitySelectable, NodeEntityUpdateable } from '@/database/models';

import { NodeEntity } from './entities/node.entity';

export class NodesMapper {
    static toEntity = (model: NodeEntitySelectable): NodeEntity => {
        return new NodeEntity({
            uuid: model.uuid,
            name: model.name,
            host: model.host,
            port: model.port,
            description: model.description,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        })
    }
    
    static toModelNew = (entity: NodeEntity): NodeEntityInsertable => {
        return {
            name: entity.name,
            host: entity.host,
            port: entity.port,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
    
    static toModel = (entity: NodeEntity): NodeEntityUpdateable => {
        return {
            name: entity.name,
            host: entity.host,
            port: entity.port,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}