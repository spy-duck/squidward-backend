export function isFrontendDisabled(): boolean {
    return process.env.DISABLE_FRONTEND === 'true';
}