export class NodeEntity {
    readonly id?: string;
    readonly name: string;
    readonly host: string;
    readonly port: string;
    readonly description: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    
    constructor(node: NodeEntity) {
        Object.assign(this, node);
        return this;
    }
}