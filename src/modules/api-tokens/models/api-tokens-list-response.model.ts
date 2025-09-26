import { ApiTokenEntity } from '@/modules/api-tokens/entities/api-token.entity';

export class ApiTokensListResponseModel {
    success: boolean;
    error: null | string;
    apiTokens: ApiTokenEntity[] | undefined;
    constructor(success: boolean, error?: null | string, apiTokens?: ApiTokenEntity[]) {
        this.success = success;
        this.error = error || null;
        this.apiTokens = apiTokens;
    }
}