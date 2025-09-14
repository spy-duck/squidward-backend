export const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    DISABLED: 'DISABLED',
    LIMITED: 'LIMITED',
    EXPIRED: 'EXPIRED',
} as const;

export type TUserStatus = [keyof typeof USER_STATUS][number];
export const USER_STATUS_VALUES = Object.values(USER_STATUS);