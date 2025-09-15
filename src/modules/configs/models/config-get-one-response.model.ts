import { ConfigEntity } from '@/modules/configs/entities/config.entity';

export class ConfigGetOneResponseModel {
    success: boolean;
    error: null | string;
    config: ConfigEntity | undefined;
    constructor(success: boolean, error?: null | string, config?: ConfigEntity) {
        this.success = success;
        this.error = error || null;
        this.config = config;
    }
}