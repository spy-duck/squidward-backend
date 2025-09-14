import { TUserStatus } from '@contract/constants';

export type CreateUserInterface = {
    name: string;
    username: string;
    password: string;
    status: TUserStatus
    email: string | null;
    telegramId: number | null;
    expireAt: Date;
}