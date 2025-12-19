import { UserMetricsEntity } from '@/modules/users/entities/user-metrics.entity';
import { TUserStatus } from '@contract/constants';

export class UserEntity {
    readonly uuid: string;
    readonly name: string;
    readonly username: string;
    readonly password: string;
    readonly status: TUserStatus
    readonly email: string | null;
    readonly telegramId: number | null;
    readonly usedTrafficBytes: number | null;
    readonly firstConnectedAt: Date | null;
    readonly expireAt: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly metrics?: UserMetricsEntity | null;
    
    constructor(user: Partial<UserEntity>) {
        Object.assign(this, user);
        return this;
    }
}