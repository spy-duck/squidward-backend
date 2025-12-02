export type CreateNodeInterface = {
    name: string;
    host: string;
    port: number;
    configId: string;
    countryCode: string;
    description?: string | null;
}