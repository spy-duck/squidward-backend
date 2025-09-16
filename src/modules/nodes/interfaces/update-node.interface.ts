export type UpdateNodeInterface = {
    uuid: string;
    name: string;
    host: string;
    port: number;
    configId: string;
    description?: string | null;
}