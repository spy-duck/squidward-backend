
export class NodeEntity {
    readonly uuid: string;
    readonly name: string;
    readonly host: string;
    readonly port: number;
    readonly description: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    
    constructor(node: Partial<NodeEntity>) {
        Object.assign(this, node);
        return this;
    }
}