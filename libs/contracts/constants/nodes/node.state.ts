export const NODE_STATE = {
    STOPPED: 'STOPPED',
    RUNNING: 'RUNNING',
    FATAL: 'FATAL',
    SHUTDOWN: 'SHUTDOWN',
    RESTARTING: 'RESTARTING'
} as const;

export type TNodeState = keyof typeof NODE_STATE;
export const NODE_STATE_VALUES: TNodeState[] = Object.values(NODE_STATE);