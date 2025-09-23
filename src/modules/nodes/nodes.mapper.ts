import { omit } from 'lodash-es';

import { NodeModelInsertable, NodeModelSelectable, NodeModelUpdateable } from '@/database/models';
import { ConfigsMapper } from '@/modules/configs/configs.mapper';
import { NodeCredentialsEntity } from '@/modules/nodes/entities';

import { NodeEntity } from './entities/node.entity';

export class NodesMapper {
    static toEntity = (model: NodeModelSelectable): NodeEntity => {
        return new NodeEntity({
            uuid: model.uuid,
            name: model.name,
            host: model.host,
            port: model.port,
            configId: model.configId,
            description: model.description,
            isConnected: model.isConnected,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            lastConnectedAt: model.lastConnectedAt,
            lastOnlineAt: model.lastOnlineAt,
            state: model.state,
            ...model.config && {
                config: ConfigsMapper.toEntity(model.config),
            }
        })
    }
    
    static toModelNew = (entity: NodeEntity): NodeModelInsertable => {
        return {
            name: entity.name,
            host: entity.host,
            port: entity.port,
            configId: entity.configId,
            description: entity.description,
            isConnected: entity.isConnected,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            lastConnectedAt: entity.lastConnectedAt,
            lastOnlineAt: entity.lastOnlineAt,
            state: entity.state,
        }
    }
    
    static toModel = (entity: NodeEntity): NodeModelUpdateable => {
        return omit(entity, [
            'config',
        ]);
    }
    
    static credentialsToPublic = (entity: NodeCredentialsEntity): string => {
        const json = JSON.stringify(entity);
        return Buffer.from(json, 'utf-8').toString('base64');
    }
}