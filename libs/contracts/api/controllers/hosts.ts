export const HOSTS_CONTROLLER = 'hosts' as const;

export const HOSTS_ROUTES = {
    LIST: '',
    CREATE: '',
    UPDATE:  (uuid: string) => uuid,
    REMOVE:  (uuid: string) => uuid,
} as const;

export const HOSTS_CONTROLLER_INFO = {
    tag: 'Hosts',
    description: 'Manage hosts, change their node alias, enable, disable, etc.',
} as const;