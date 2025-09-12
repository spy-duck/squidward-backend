export const NODES_CONTROLLER = 'nodes' as const;

export const NODES_ROUTES = {
    CREATE: 'create',
    UPDATE:  (uuid: string) => uuid, // put method
    REMOVE:  (uuid: string) => uuid, // delete method
    LIST: '',
} as const;