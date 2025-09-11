export class NodesListResponseModel {
    success: boolean;
    error: null | string;
    nodes: any[] | undefined;
    constructor(success: boolean, error?: null | string, nodes?: any[]) {
        this.success = success;
        this.error = error || null;
        this.nodes = nodes;
    }
}