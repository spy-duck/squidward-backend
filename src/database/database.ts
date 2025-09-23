import { Kysely } from 'kysely';

import { CertModel, ConfigModel, NodeModel, UserModel } from './models';

export interface TDatabase {
    nodes: NodeModel;
    users: UserModel;
    configs: ConfigModel;
    certs: CertModel;
}

export class Database extends Kysely<TDatabase> {}
