export const ERRORS = {
    INTERNAL_SERVER_ERROR: { code: 'A001', message: 'Server error', httpCode: 500 },
    UNAUTHORIZED: { code: 'A003', message: 'Unauthorized', httpCode: 401 },
    SQUID_ALREADY_RUNNING: { code: 'S001', message: 'Squid is already running', httpCode: 400 },
    SQUID_IS_NOT_RUNNING: { code: 'S002', message: 'Squid is not running', httpCode: 400 },
    SQUID_CONFIG_VALIDATION_FAILED: { code: 'S003', message: 'Squid config validation failed', httpCode: 400 },
    CONFIG_NOT_FOUND: { code: 'C001', message: 'Config not found', httpCode: 404 },
    CONFIG_IS_USED_BY_NODES: { code: 'C002', message: 'Some nodes using this config', httpCode: 400 },
    NODE_NOT_FOUND: { code: 'N001', message: 'Node not found', httpCode: 404 },
    NODE_INVALID_STATUS_FOR_START: { code: 'N002', message: 'Start failed. Invalid status of node', httpCode: 400 },
};