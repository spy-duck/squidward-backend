import { Generated, Selectable, Insertable, Updateable } from 'kysely';


export interface ConfigModel {
    uuid: Generated<string>;
    name: string;
    config: string;
    version: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ConfigModelInsertable = Insertable<ConfigModel>;
export type ConfigModelSelectable = Selectable<ConfigModel>;
export type ConfigModelUpdateable = Updateable<ConfigModel>;