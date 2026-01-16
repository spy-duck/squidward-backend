import { MasterCertEntity } from '@/modules/certs/entities/master-cert.entity';
import { CertModelSelectable } from '@/database/models';

export class CertsMapper {
    static toEntity = (model: CertModelSelectable): MasterCertEntity => {
        return new MasterCertEntity({
            uuid: model.uuid,
            caCertPem: model.caCertPem,
            caKeyPem: model.caKeyPem,
            clientCertPem: model.clientCertPem,
            clientKeyPem: model.clientKeyPem,
            publicKey: model.publicKey,
            privateKey: model.privateKey,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        })
    }
}