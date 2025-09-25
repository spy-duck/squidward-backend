export const CLIENT_TYPE_HEADER = 'X-Squidward-Client-Type';

export const CLIENT_TYPE_BROWSER = 'browser';

export const REAL_IP_HEADER = 'x-squidward-real-ip';

export const BYPASS_HTTPS_RESTRCTIONS = {
    'x-forwarded-proto': 'https',
    'x-forwarded-for': '127.0.0.1',
} as const;