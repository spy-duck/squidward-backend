import { Kysely } from 'kysely';

import {
    AdminModel,
    ApiTokenModel,
    CertModel,
    ConfigModel,
    NodeModel,
    UserModel,
} from './models';

export interface TDatabase {
    admins: AdminModel;
    apiTokens: ApiTokenModel;
    nodes: NodeModel;
    users: UserModel;
    configs: ConfigModel;
    certs: CertModel;
}

export class Database extends Kysely<TDatabase> {}
