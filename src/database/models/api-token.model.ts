import { Generated, Selectable, Insertable, Updateable } from 'kysely';

export interface ApiTokenModel {
    uuid: Generated<string>;
    token: string;
    tokenName: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ApiTokenModelInsertable = Insertable<Omit<ApiTokenModel, 'createdAt' | 'updatedAt'>>;
export type ApiTokenModelSelectable = Selectable<ApiTokenModel>;
export type ApiTokenModelUpdateable = Updateable<ApiTokenModel>;