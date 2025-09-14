import { Generated, Selectable, Insertable, Updateable } from 'kysely';

import { TNodeState } from '@contract/constants/nodes/node.state';

export interface NodeModel {
    uuid: Generated<string>;
    name: string;
    host: string;
    port: number;
    description: string | null;
    isEnabled: boolean;
    isConnected: boolean;
    state: TNodeState;
    createdAt?: Date;
    updatedAt?: Date;
    lastConnectedAt?: Date;
    lastOnlineAt?: Date;
}

export type NodeModelInsertable = Insertable<NodeModel>;
export type NodeModelSelectable = Selectable<NodeModel>;
export type NodeModelUpdateable = Updateable<NodeModel>;