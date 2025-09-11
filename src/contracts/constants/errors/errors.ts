export const ERRORS = {
    INTERNAL_SERVER_ERROR: { code: 'A001', message: 'Server error', httpCode: 500 },
    UNAUTHORIZED: { code: 'A003', message: 'Unauthorized', httpCode: 401 },
    SQUID_ALREADY_RUNNING: { code: 'S001', message: 'Squid is already running', httpCode: 400 },
    SQUID_IS_NOT_RUNNING: { code: 'S002', message: 'Squid is not running', httpCode: 400 },
    SQUID_CONFIG_VALIDATION_FAILED: { code: 'S003', message: 'Squid config validation failed', httpCode: 400 },
};