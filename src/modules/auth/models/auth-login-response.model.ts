export class AuthLoginResponseModel {
    success: boolean;
    error: null | string;
    accessToken: null | string;
    
    constructor(success: boolean, error?: null | string, accessToken?: string) {
        this.success = success;
        this.error = error || null;
        this.accessToken = accessToken || null;
    }
}