import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { JOBS_INTERVALS } from '@/scheduler/intervals';
import { NodesRemoveUserQueueService } from '@/queues';

@Injectable()
export class CheckForExpireSubscriptionTask {
    private static readonly CRON_NAME = 'checkForExpireSubscriptionTask';
    private readonly logger = new Logger(CheckForExpireSubscriptionTask.name);
    
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly nodesRemoveUserQueueService: NodesRemoveUserQueueService,
    ) {}
    
    @Cron(JOBS_INTERVALS.CHECK_EXPIRE_SUBSCRIPTIONS, {
        name: CheckForExpireSubscriptionTask.CRON_NAME,
        waitForCompletion: true,
    })
    async handleCron() {
        const users = await this.usersRepository.getAllExpired();
        for (const user of users) {
            try {
                await this.nodesRemoveUserQueueService.removeUser({
                    userUuid: user.uuid
                });
                await this.usersRepository.update({
                    ...user,
                    status: 'EXPIRED',
                    updatedAt: new Date(),
                });
            } catch (error) {
                this.logger.error(`Error in CheckForExpireSubscriptionTask: ${ error }`);
            }
        }
    }
}