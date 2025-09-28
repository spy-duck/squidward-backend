import { HostEntity } from '../entities/host.entity';

export class HostsListResponseModel {
    success: boolean;
    error: null | string;
    hosts: HostEntity[] | undefined;
    
    constructor(success: boolean, error?: null | string, hosts?: HostEntity[]) {
        this.success = success;
        this.error = error || null;
        this.hosts = hosts;
    }
}