export class MasterCertEntity {
    readonly uuid: string;
    readonly caCertPem: string;
    readonly caKeyPem: string;
    readonly clientCertPem: string;
    readonly clientKeyPem: string;
    readonly publicKey: string;
    readonly privateKey: string;
    readonly createdAt: Date | undefined;
    readonly updatedAt: Date | undefined;
    
    constructor(config: Partial<MasterCertEntity>) {
        Object.assign(this, config);
        return this;
    }
}