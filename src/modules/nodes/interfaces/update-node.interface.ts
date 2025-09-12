export type UpdateNodeInterface = {
    uuid: string;
    name: string;
    host: string;
    port: number;
    description?: string | null;
    isEnabled: boolean;
}