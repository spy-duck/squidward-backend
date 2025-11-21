import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { JOBS_INTERVALS } from '@/scheduler/intervals';
import { NodesRemoveUserQueueService } from '@/queues';
import { USER_STATUS } from '@contract/constants';


@Injectable()
export class CheckExpireSubscriptionsTask {
    private static readonly CRON_NAME = 'checkExpireSubscriptions';
    private readonly logger = new Logger(CheckExpireSubscriptionsTask.name);
    
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly nodesRemoveUserQueueService: NodesRemoveUserQueueService,
    ) {}
    
    @Cron(JOBS_INTERVALS.CHECK_EXPIRE_SUBSCRIPTIONS, {
        name: CheckExpireSubscriptionsTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        const users = await this.usersRepository.getAllExpired();
        for (const user of users) {
            try {
                await this.nodesRemoveUserQueueService.removeUser({
                    userUuid: user.uuid,
                });
                await this.usersRepository.update({
                    ...user,
                    status: USER_STATUS.EXPIRED,
                })
            } catch (error) {
                this.logger.error(`Error: ${ error }`);
            }
        }
    }
}