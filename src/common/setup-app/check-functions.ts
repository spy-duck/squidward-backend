export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

export function isFrontendDisabled(): boolean {
    return process.env.DISABLE_FRONTEND === 'true';
}