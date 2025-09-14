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
            isEnabled: model.isEnabled,
            isConnected: model.isConnected,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            lastConnectedAt: model.lastConnectedAt,
            lastOnlineAt: model.lastOnlineAt,
            state: model.state,
        })
    }
    
    static toModelNew = (entity: NodeEntity): NodeEntityInsertable => {
        return {
            name: entity.name,
            host: entity.host,
            port: entity.port,
            description: entity.description,
            isEnabled: entity.isEnabled,
            isConnected: entity.isConnected,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            lastConnectedAt: entity.lastConnectedAt,
            lastOnlineAt: entity.lastOnlineAt,
            state: entity.state,
        }
    }
    
    static toModel = (entity: NodeEntity): NodeEntityUpdateable => {
        return entity;
    }
}