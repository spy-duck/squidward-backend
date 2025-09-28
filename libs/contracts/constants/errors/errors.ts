export const ERRORS = {
    INTERNAL_SERVER_ERROR: { code: 'A001', message: 'Server error', httpCode: 500 },
    UNAUTHORIZED: { code: 'A003', message: 'Unauthorized', httpCode: 401 },
    FORBIDDEN_ROLE_ERROR: { code: 'A004', message: 'Forbidden role error', httpCode: 403 },
    INVALID_CREDENTIALS: { code: 'A005', message: 'Invalid credentials', httpCode: 403 },
    FORBIDDEN_ERROR: { code: 'A006', message: 'Forbidden error', httpCode: 403 },
    
    SQUID_ALREADY_RUNNING: { code: 'S001', message: 'Squid is already running', httpCode: 400 },
    SQUID_IS_NOT_RUNNING: { code: 'S002', message: 'Squid is not running', httpCode: 400 },
    SQUID_CONFIG_VALIDATION_FAILED: { code: 'S003', message: 'Squid config validation failed', httpCode: 400 },
    
    CONFIG_NOT_FOUND: { code: 'C001', message: 'Config not found', httpCode: 404 },
    CONFIG_IS_USED_BY_NODES: { code: 'C002', message: 'Some nodes using this config', httpCode: 400 },
    
    NODE_NOT_FOUND: { code: 'N001', message: 'Node not found', httpCode: 404 },
    NODE_INVALID_STATUS_FOR_START: { code: 'N002', message: 'Start failed. Invalid status of node', httpCode: 400 },
    NODE_ALREADY_EXISTS: { code: 'N003', message: 'Node already exists', httpCode: 400 },
    
    USER_NOT_FOUND: { code: 'U001', message: 'User not found', httpCode: 404 },
    USER_ALREADY_EXISTS: { code: 'U002', message: 'User already exists', httpCode: 400 },
    
    KEYGEN_ERROR: { code: 'K001', message: 'Keygen error', httpCode: 400 },
    
    ADMIN_FORBIDDEN_CREDENTIALS_ERROR: { code: 'D006', message: 'Don\'t use the default username. IT\'S NOT SECURE!', httpCode: 400 },
    
    API_TOKEN_ALREADY_EXISTS: { code: 'T001', message: 'API token already exists', httpCode: 400 },
    
    HOST_NOT_FOUND: { code: 'H001', message: 'Host not found', httpCode: 404 },
    HOST_ALREADY_EXISTS: { code: 'H002', message: 'Host already exists', httpCode: 400 },
    
};