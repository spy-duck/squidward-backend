import { NodeEntity } from '@/modules/nodes/entities/node.entity';

export class NodesListResponseModel {
    success: boolean;
    error: null | string;
    nodes: NodeEntity[] | undefined;
    constructor(success: boolean, error?: null | string, nodes?: NodeEntity[]) {
        this.success = success;
        this.error = error || null;
        this.nodes = nodes;
    }
}