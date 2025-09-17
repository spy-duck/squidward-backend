import { Injectable } from '@nestjs/common';

import { USER_STATUS } from '@contract/constants';
import { Database } from '@/database/database';

import { UserEntity } from '../entities/user.entity';
import { UsersMapper } from '../users.mapper';

@Injectable()
export class UsersRepository {
    constructor(
        private readonly db: Database,
    ) {}
    
    async create(userEntity: UserEntity): Promise<UserEntity> {
        const user = await this.db
            .insertInto('users')
            .values(UsersMapper.toModelNew(userEntity))
            .returningAll()
            .executeTakeFirstOrThrow();
        return UsersMapper.toEntity(user);
    }
    
    async getAll(): Promise<UserEntity[]> {
        const users = await this.db
            .selectFrom('users')
            .selectAll()
            .execute();
        return users.map(UsersMapper.toEntity);
    }
    
    async getAllActive(): Promise<UserEntity[]> {
        const users = await this.db
            .selectFrom('users')
            .selectAll()
            .where('status', '=', USER_STATUS.ACTIVE)
            .execute();
        return users.map(UsersMapper.toEntity);
    }
    
    async delete(userUuid: string): Promise<void> {
        await this.db
            .deleteFrom('users')
            .where('uuid', '=', userUuid)
            .execute();
    }
    
    async update(userEntity: UserEntity): Promise<UserEntity> {
        const user = await this.db
            .updateTable('users')
            .set(UsersMapper.toModel(userEntity))
            .where('uuid', '=', userEntity.uuid)
            .returningAll()
            .executeTakeFirstOrThrow();
        return UsersMapper.toEntity(user);
    }
    
    async findExist(
        name: string,
        username: string,
        email: string | null,
        telegramId: number | null,
        excludeUuid?: string,
    ): Promise<UserEntity | null> {
        const user = await this.db
            .selectFrom('users')
            .selectAll()
            .$if(!!excludeUuid, (wb) => wb.where('uuid', '!=', excludeUuid!))
            .where((wb) => wb.or([
                wb('name', '=', name),
                wb('username', '=', username),
                ...(email !== null ? [
                    wb('email', '=', email)
                ] : []),
                ...(telegramId !== null ? [
                    wb('telegramId', '=', telegramId)
                ] : []),
            ]))
            .executeTakeFirst();
        return user ? UsersMapper.toEntity(user) : null;
    }
}