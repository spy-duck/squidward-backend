import { CronExpression } from '@nestjs/schedule';

export const JOBS_INTERVALS = {
    NODE_HEALTH_CHECK: CronExpression.EVERY_10_SECONDS,
}