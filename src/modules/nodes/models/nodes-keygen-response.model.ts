export class NodesKeygenResponseModel {
    success: boolean;
    credentials: string;
    error: null | string;
    constructor(success: boolean, credentials: string, error?: null | string) {
        this.success = success;
        this.error = error || null;
        this.credentials = credentials;
    }
}