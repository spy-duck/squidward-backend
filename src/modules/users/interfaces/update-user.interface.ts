import { TUserStatus } from '@contract/constants';

export type UpdateUserInterface = {
    uuid: string;
    name: string;
    username: string;
    password?: string | undefined | null;
    status: TUserStatus
    email: string | null;
    telegramId: number | null;
    expireAt?: Date;
}