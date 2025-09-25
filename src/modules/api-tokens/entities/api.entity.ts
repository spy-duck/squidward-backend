export class ApiEntity {
    public uuid: string;
    public token: string;
    public tokenName: string;
    public createdAt: Date;
    public updatedAt: Date;
    
    constructor(apiToken: Partial<ApiEntity>) {
        Object.assign(this, apiToken);
        return this;
    }
}