import { NodeMetricsEntity } from '@/modules/nodes/entities/node-metrics.entity';
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
    readonly countryCode: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly lastConnectedAt: Date;
    readonly lastOnlineAt: Date;
    readonly lastCheckHealth: Date;
    readonly state: TNodeState;
    readonly version: string | null;
    readonly config: Pick<ConfigEntity, 'name'> | null;
    readonly httpPort: number;
    readonly httpsEnabled: boolean | null;
    readonly httpsPort: number | null;
    readonly speedLimitEnabled: boolean | null;
    readonly speedLimit: number | null;
    
    readonly metrics?: NodeMetricsEntity | null;
    
    constructor(node: Partial<NodeEntity>) {
        Object.assign(this, node);
        return this;
    }
}
