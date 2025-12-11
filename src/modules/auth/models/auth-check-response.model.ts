export class AuthCheckResponseModel {
    success: boolean;
    error: null | string;
    isChangePasswordRequired: null | boolean;
    version: null | string;
    
    constructor(
        success: boolean,
        error?: null | string,
        isChangePasswordRequired?: null | boolean,
        version?: null | string,
    ) {
        this.success = success;
        this.error = error || null;
        this.isChangePasswordRequired = isChangePasswordRequired || false;
        this.version = version || null;
    }
}