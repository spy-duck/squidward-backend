export class HostEntity {
    public uuid: string;
    public name: string;
    public url: string;
    public countryCode: string;
    public nodeId: string;
    public enabled: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public priority: number;
    public isNew: boolean;
    
    constructor(apiToken: Partial<HostEntity>) {
        Object.assign(this, apiToken);
        return this;
    }
}