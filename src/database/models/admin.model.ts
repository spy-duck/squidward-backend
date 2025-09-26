import { Generated, Selectable, Insertable, Updateable } from 'kysely';

import { TRoleTypes } from '@contract/constants';


export interface AdminModel {
    uuid: Generated<string>;
    username: string;
    passwordHash: string;
    role: TRoleTypes;
    isInitialPasswordChanged: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type AdminModelInsertable = Insertable<Omit<AdminModel, 'createdAt' | 'updatedAt'>>;
export type AdminModelSelectable = Selectable<AdminModel>;
export type AdminModelUpdateable = Updateable<AdminModel>;