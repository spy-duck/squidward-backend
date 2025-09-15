import { ConfigEntity } from '@/modules/configs/entities/config.entity';

export class ConfigsListResponseModel {
    success: boolean;
    error: null | string;
    configs: ConfigEntity[] | undefined;
    constructor(success: boolean, error?: null | string, configs?: ConfigEntity[]) {
        this.success = success;
        this.error = error || null;
        this.configs = configs;
    }
}