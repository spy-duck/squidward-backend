import { Generated, Selectable, Insertable, Updateable } from 'kysely';

import { NodeState } from '@contract/constants/nodes/node-state';

export interface NodeModel {
    uuid: Generated<string>;
    name: string;
    host: string;
    port: number;
    description: string | null;
    isEnabled: boolean;
    isConnected: boolean;
    state: NodeState;
    createdAt?: Date;
    updatedAt?: Date;
    lastConnectedAt?: Date;
    lastOnlineAt?: Date;
}

export type NodeEntityInsertable = Insertable<NodeModel>;
export type NodeEntitySelectable = Selectable<NodeModel>;
export type NodeEntityUpdateable = Updateable<NodeModel>;