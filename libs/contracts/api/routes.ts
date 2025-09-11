import * as CONTROLLERS from './controllers';

export const ROOT = '/api' as const;

export const REST_API = {
    NODES: {
        CREATE: `${ROOT}/${CONTROLLERS.NODES_CONTROLLER}/${CONTROLLERS.NODES_ROUTES.CREATE}`,
        LIST: `${ROOT}/${CONTROLLERS.NODES_CONTROLLER}/${CONTROLLERS.NODES_ROUTES.LIST}`,
    },
}