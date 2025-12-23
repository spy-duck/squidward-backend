import { CronExpression } from '@nestjs/schedule';

export const JOBS_INTERVALS = {
    NODE_HEALTH_CHECK: CronExpression.EVERY_10_SECONDS,
    CHECK_EXPIRE_SUBSCRIPTIONS: CronExpression.EVERY_30_SECONDS,
    NODE_GET_USERS_METRICS: CronExpression.EVERY_30_SECONDS,
    NODE_GET_NODE_METRICS: CronExpression.EVERY_30_SECONDS,
}
