import { UserEntity } from '@/modules/users/entities/user.entity';

export class UsersListResponseModel {
    success: boolean;
    error: null | string;
    users: UserEntity[] | undefined;
    constructor(success: boolean, error?: null | string, users?: UserEntity[]) {
        this.success = success;
        this.error = error || null;
        this.users = users;
    }
}