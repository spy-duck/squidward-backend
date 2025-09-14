export const USERS_CONTROLLER = 'users' as const;

export const USERS_ROUTES = {
    LIST: '', // get method
    CREATE: '', // post method
    UPDATE:  (uuid: string) => uuid, // put method
    REMOVE:  (uuid: string) => uuid, // delete method
} as const;