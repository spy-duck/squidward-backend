export class NodeMetricsEntity {
    readonly nodeUuid: string;
    readonly upload: bigint;
    readonly download: bigint;
    readonly total: bigint;
    
    constructor(entity: Partial<NodeMetricsEntity>) {
        Object.assign(this, entity);
        return this;
    }
}