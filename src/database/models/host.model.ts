

import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface HostModel {
    uuid: Generated<string>;
    name: string;
    url: string;
    countryCode: string;
    nodeId: string;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    isNew: boolean;
}

export type HostModelInsertable = Insertable<HostModel>;
export type HostModelSelectable = Selectable<HostModel>;
export type HostModelUpdateable = Updateable<HostModel>;