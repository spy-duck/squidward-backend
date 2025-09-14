import { Generated, Selectable, Insertable, Updateable } from 'kysely';

import { TUserStatus } from '@contract/constants/users';

export interface UserModel {
    uuid: Generated<string>;
    name: string;
    username: string;
    password: string;
    status: TUserStatus
    email: string | null;
    telegramId: number | null;
    usedTrafficBytes: number | null;
    firstConnectedAt: Date | null;
    expireAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserModelInsertable = Insertable<UserModel>;
export type UserModelSelectable = Selectable<UserModel>;
export type UserModelUpdateable = Updateable<UserModel>;