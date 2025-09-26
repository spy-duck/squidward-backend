export class ApiTokenEntity {
    public uuid: string;
    public token: string;
    public tokenName: string;
    public expireAt: Date;
    public createdAt: Date;
    
    constructor(apiToken: Partial<ApiTokenEntity>) {
        Object.assign(this, apiToken);
        return this;
    }
}