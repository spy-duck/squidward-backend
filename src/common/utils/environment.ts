export function isProcessorsInstance() {
    return process.env.INSTANCE === 'processors';
}

export function isSchedulerInstance() {
    return process.env.INSTANCE === 'scheduler';
}