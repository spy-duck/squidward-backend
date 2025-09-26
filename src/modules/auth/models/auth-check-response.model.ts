export class AuthCheckResponseModel {
    success: boolean;
    error: null | string;
    isChangePasswordRequired: null | boolean;
    
    constructor(success: boolean, error?: null | string, isChangePasswordRequired?: null | boolean) {
        this.success = success;
        this.error = error || null;
        this.isChangePasswordRequired = isChangePasswordRequired || false;
    }
}