export const NODES_CONTROLLER = 'nodes' as const;

export const NODES_ROUTES = {
    CREATE: '',
    UPDATE:  (uuid: string) => uuid, // put method
    REMOVE:  (uuid: string) => uuid, // delete method
    LIST: '',
    START:  (uuid: string) => `${uuid}/action/start`,
    STOP:  (uuid: string) => `${uuid}/action/stop`,
    RESTART:  (uuid: string) => `${uuid}/action/restart`,
    KEYGEN: 'keygen',
} as const;

export const NODES_CONTROLLER_INFO = {
    tag: 'Nodes',
    description: 'Manages nodes, starts and stops them and etc.',
} as const;