import { Generated, Selectable, Insertable, Updateable } from 'kysely';


export interface CertModel {
    uuid: Generated<string>;
    caCertPem: string,
    caKeyPem: string,
    clientCertPem: string,
    clientKeyPem: string,
    publicKey: string,
    privateKey: string,
    createdAt?: Date;
    updatedAt?: Date;
}

export type CertModelInsertable = Insertable<CertModel>;
export type CertModelSelectable = Selectable<CertModel>;
export type CertModelUpdateable = Updateable<CertModel>;