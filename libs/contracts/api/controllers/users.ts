export const USERS_CONTROLLER = 'users' as const;

export const USERS_ROUTES = {
    LIST: '', // get method
    CREATE: '', // post method
    UPDATE:  (uuid: string) => uuid, // put method
    REMOVE:  (uuid: string) => uuid, // delete method
    RESET_TRAFFIC:  (uuid: string) => `${uuid}/reset-traffic`,
} as const;

export const USERS_CONTROLLER_INFO = {
    tag: 'Users',
    description: 'Manage users, change their status, reset traffic, etc.',
} as const;