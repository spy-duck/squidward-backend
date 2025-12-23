import { Injectable } from '@nestjs/common';

import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { sql } from 'kysely';

import { USER_STATUS } from '@contract/constants';
import { Database } from '@/database/database';

import { UsersMapper } from '../mappers/users.mapper';
import { UserEntity } from '../entities/user.entity';

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
            .select([
                (sb) => jsonObjectFrom(
                    sb
                        .selectFrom('usersMetrics')
                        .select([
                            sql<number>`SUM(upload)`.as('upload'),
                            sql<number>`SUM(download)`.as('download'),
                            sql<number>`SUM(total)`.as('total'),
                        ])
                        .whereRef('userUuid', '=', 'users.uuid')
                        .groupBy('userUuid')
                )
                    .as('metrics'),
            ])
            .orderBy('expireAt', 'asc')
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
    
    async getByUuid(userUuid: string): Promise<UserEntity | null> {
        const user = await this.db
            .selectFrom('users')
            .selectAll()
            .where('uuid', '=', userUuid)
            .executeTakeFirst();
        return user ? UsersMapper.toEntity(user) : null;
    }
    
    async delete(userUuid: string): Promise<void> {
        await this.db.transaction().execute(async (trx) => {
            await trx
                .deleteFrom('usersMetrics')
                .where('userUuid', '=', userUuid)
                .execute();
            await trx
                .deleteFrom('users')
                .where('uuid', '=', userUuid)
                .execute();
        });
    }
    
    async update(userEntity: UserEntity): Promise<UserEntity> {
        const user = await this.db
            .updateTable('users')
            .set(UsersMapper.toModel({
                ...userEntity,
                updatedAt: new Date(),
            }))
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
    
    async getAllExpired(): Promise<UserEntity[]> {
        const users = await this.db
            .selectFrom('users')
            .selectAll()
            .where('status', '=', USER_STATUS.ACTIVE)
            .where('expireAt', '<=', new Date())
            .execute();
        return users.map(UsersMapper.toEntity);
    }
}
