import { TUserStatus } from '@contract/constants';

export type UpdateUserInterface = {
    name: string;
    username: string;
    password: string | undefined;
    status: TUserStatus
    email: string | null;
    telegramId: number | null;
    expireAt: Date;
}