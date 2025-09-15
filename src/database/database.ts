import { Kysely } from 'kysely';

import { ConfigModel, NodeModel, UserModel } from './models';

export interface TDatabase {
    nodes: NodeModel;
    users: UserModel;
    configs: ConfigModel;
}

export class Database extends Kysely<TDatabase> {}
