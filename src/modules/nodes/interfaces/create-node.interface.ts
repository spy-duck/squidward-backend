export type CreateNodeInterface = {
    name: string;
    host: string;
    port: number;
    configId: string;
    description?: string | null;
}