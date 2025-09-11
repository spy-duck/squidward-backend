import { NodeModel } from '@/database/models';

import { NodeEntity } from './entities/node.entity';

export class NodesMapper {
    static toEntity = (model: NodeModel): NodeEntity => {
        return new NodeEntity({
            id: model.id,
            name: model.name,
            host: model.host,
            port: model.port,
            description: model.description,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        })
    }
    
    static toModel = (entity: NodeEntity): NodeModel => {
        return {
            id: entity.id,
            name: entity.name,
            host: entity.host,
            port: entity.port,
            description: entity.description,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}