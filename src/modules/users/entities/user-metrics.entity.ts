export class UserMetricsEntity {
    readonly userUuid: string;
    readonly nodeUuid: string;
    readonly upload: bigint;
    readonly download: bigint;
    readonly total: bigint;
    
    constructor(entity: Partial<UserMetricsEntity>) {
        Object.assign(this, entity);
        return this;
    }
}