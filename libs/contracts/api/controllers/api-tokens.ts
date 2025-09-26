export const API_TOKENS_CONTROLLER = 'api-tokens' as const;

export const API_TOKENS_ROUTES = {
    LIST: '',
    CREATE: '',
    REMOVE:  (uuid: string) => uuid,
} as const;

export const API_TOKENS_CONTROLLER_INFO = {
    tag: 'API Tokens',
    description: 'Manage API tokens.',
} as const;