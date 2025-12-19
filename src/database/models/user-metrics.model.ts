import { Selectable, Insertable, Updateable } from 'kysely';


export interface UserMetricsModel {
    userUuid: string;
    nodeUuid: string;
    download: number;
    upload: number;
    total: number;
}

export type UserMetricsModelInsertable = Insertable<UserMetricsModel>;
export type UserMetricsModelSelectable = Selectable<UserMetricsModel>;
export type UserMetricsModelUpdateable = Updateable<UserMetricsModel>;