import { CronExpression } from '@nestjs/schedule';

export const JOBS_INTERVALS = {
    NODE_HEALTH_CHECK: CronExpression.EVERY_10_SECONDS,
    CHECK_EXPIRED_USERS: CronExpression.EVERY_5_SECONDS,
}