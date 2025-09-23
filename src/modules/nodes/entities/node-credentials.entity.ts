export class NodeCredentialsEntity {
    readonly nodeCertPem: string;
    readonly nodeKeyPem: string;
    readonly caCertPem: string;
    readonly jwtPublicKey: string;
    
    constructor(node: Partial<NodeCredentialsEntity>) {
        Object.assign(this, node);
        return this;
    }
}