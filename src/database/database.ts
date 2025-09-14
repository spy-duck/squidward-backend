import { Kysely } from 'kysely';

import { NodeModel, UserModel } from './models';

export interface TDatabase {
    nodes: NodeModel;
    users: UserModel;
}

export class Database extends Kysely<TDatabase> {}
