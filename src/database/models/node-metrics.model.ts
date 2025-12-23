import { Selectable, Insertable, Updateable } from 'kysely';


export interface NodeMetricsModel {
    nodeUuid: string;
    download: number;
    upload: number;
    total: number;
}

export type NodeMetricsModelInsertable = Insertable<NodeMetricsModel>;
export type NodeMetricsModelSelectable = Selectable<NodeMetricsModel>;
export type NodeMetricsModelUpdateable = Updateable<NodeMetricsModel>;