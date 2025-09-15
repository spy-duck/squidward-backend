export class ConfigEntity {
    readonly uuid: string;
    readonly name: string;
    readonly config: string;
    readonly version: string;
    readonly createdAt: Date | undefined;
    readonly updatedAt: Date | undefined;
    
    constructor(config: Partial<ConfigEntity>) {
        Object.assign(this, config);
        return this;
    }
}