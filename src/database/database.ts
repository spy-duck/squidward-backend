import { Kysely } from 'kysely';

import { NodeModel } from './models';

export interface TDatabase {
    nodes: NodeModel;
}

export class Database extends Kysely<TDatabase> {}
