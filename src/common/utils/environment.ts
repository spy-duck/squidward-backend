export function isProcessorsInstance() {
    return process.env.INSTANCE_TYPE === 'processors';
}

export function isSchedulerInstance() {
    return process.env.INSTANCE_TYPE === 'scheduler';
}