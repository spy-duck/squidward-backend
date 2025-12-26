import { Selectable, Insertable, Updateable } from 'kysely';


export interface NodeOnlineModel {
    nodeUuid: string;
    onlineUsers: number;
}

export type NodeOnlineModelInsertable = Insertable<NodeOnlineModel>;
export type NodeOnlineModelSelectable = Selectable<NodeOnlineModel>;
export type NodeOnlineModelUpdateable = Updateable<NodeOnlineModel>;