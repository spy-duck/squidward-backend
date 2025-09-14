import { TNodeState } from '@contract/constants/nodes/node.state';

export class NodeEntity {
    readonly uuid: string;
    readonly name: string;
    readonly host: string;
    readonly port: number;
    readonly description: string | null;
    readonly isEnabled: boolean;
    readonly isConnected: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly lastConnectedAt: Date;
    readonly lastOnlineAt: Date;
    readonly state: TNodeState;
    
    constructor(node: Partial<NodeEntity>) {
        Object.assign(this, node);
        return this;
    }
}