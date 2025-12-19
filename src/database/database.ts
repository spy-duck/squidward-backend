import { Kysely } from 'kysely';

import {
    AdminModel,
    ApiTokenModel,
    CertModel,
    ConfigModel,
    HostModel,
    NodeModel, UserMetricsModel,
    UserModel,
} from './models';

export interface TDatabase {
    admins: AdminModel;
    apiTokens: ApiTokenModel;
    certs: CertModel;
    configs: ConfigModel;
    hosts: HostModel;
    nodes: NodeModel;
    users: UserModel;
    usersMetrics: UserMetricsModel;
}

export class Database extends Kysely<TDatabase> {}
