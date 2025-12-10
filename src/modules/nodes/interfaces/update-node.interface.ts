export type UpdateNodeInterface = {
    uuid: string;
    name: string;
    host: string;
    port: number;
    configId: string;
    countryCode: string;
    description?: string | null;
    httpPort?: number;
    httpsEnabled?: boolean | null;
    httpsPort?: number | null;
    speedLimitEnabled?: boolean | null;
    speedLimit?: number | null;
}