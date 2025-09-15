export const CONFIGS_CONTROLLER = 'configs' as const;

export const CONFIGS_ROUTES = {
    LIST: '', // get method
    CREATE: '', // post method
    UPDATE:  (uuid: string) => uuid, // put method
    REMOVE:  (uuid: string) => uuid, // delete method
    GET_ONE:  (uuid: string) => uuid, // get method
} as const;