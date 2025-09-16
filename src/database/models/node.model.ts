import { Generated, Selectable, Insertable, Updateable } from 'kysely';

import { ConfigModelSelectable } from '@/database/models/config.model';
import { TNodeState } from '@contract/constants/nodes/node.state';

export interface NodeModel {
    uuid: Generated<string>;
    name: string;
    host: string;
    port: number;
    configId: string;
    description: string | null;
    isConnected: boolean;
    state: TNodeState;
    createdAt?: Date;
    updatedAt?: Date;
    lastConnectedAt?: Date;
    lastOnlineAt?: Date;
    config?: ConfigModelSelectable;
}

export type NodeModelInsertable = Insertable<NodeModel>;
export type NodeModelSelectable = Selectable<NodeModel>;
export type NodeModelUpdateable = Updateable<NodeModel>;