import {
    NodeMetricsModelInsertable, NodeMetricsModelSelectable,
} from '@/database/models';
import { NodeMetricsEntity } from '@/modules/nodes/entities';


export class NodeMetricsMapper {
    static toEntity = (model: Partial<NodeMetricsModelSelectable>): NodeMetricsEntity => {
        return new NodeMetricsEntity({
            nodeUuid: model.nodeUuid,
            upload: BigInt(model.upload || 0),
            download: BigInt(model.download || 0),
            total: BigInt(model.total || 0),
        })
    }
    
    static toModel = (entity: NodeMetricsEntity): NodeMetricsModelInsertable => {
        return {
            nodeUuid: entity.nodeUuid,
            upload: Number(entity.upload),
            download: Number(entity.download),
            total: Number(entity.total),
        };
    }
}