import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface NodeModel {
    uuid: Generated<string>;
    name: string;
    host: string;
    port: number;
    description: string | null;
    isEnabled: boolean;
    isConnected: boolean;
    isOnline: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    lastConnectedAt?: Date;
    lastOnlineAt?: Date;
}

export type NodeEntityInsertable = Insertable<NodeModel>;
export type NodeEntitySelectable = Selectable<NodeModel>;
export type NodeEntityUpdateable = Updateable<NodeModel>;