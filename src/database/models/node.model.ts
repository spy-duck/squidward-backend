export interface NodeModel {
    id?: string;
    name: string;
    host: string;
    port: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}