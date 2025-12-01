import { ConfigEntity } from '@/modules/configs/entities/config.entity';
import { TNodeState } from '@contract/constants/nodes/node.state';

export class NodeEntity {
    readonly uuid: string;
    readonly name: string;
    readonly host: string;
    readonly port: number;
    readonly configId: string;
    readonly description: string | null;
    readonly isConnected: boolean;
    readonly isStarted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly lastConnectedAt: Date;
    readonly lastOnlineAt: Date;
    readonly lastCheckHealth: Date;
    readonly state: TNodeState;
    readonly config: Pick<ConfigEntity, 'name'> | null;
    
    constructor(node: Partial<NodeEntity>) {
        Object.assign(this, node);
        return this;
    }
}