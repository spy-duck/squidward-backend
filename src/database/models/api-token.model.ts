import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface ApiTokenModel {
    uuid: Generated<string>;
    token: string;
    tokenName: string;
    expireAt: Date;
    createdAt: Date;
}

export type ApiTokenModelInsertable = Insertable<ApiTokenModel>;
export type ApiTokenModelSelectable = Selectable<ApiTokenModel>;
export type ApiTokenModelUpdateable = Updateable<ApiTokenModel>;