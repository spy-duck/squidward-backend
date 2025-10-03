import { utilities as winstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import winston, { createLogger } from 'winston';

import { isDevelopment } from '@/common/setup-app/check-functions';

export function getLogger(appName: string, instanceId?: string) {
    return createLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS',
            }),
            winston.format.align(),
            winstonModuleUtilities.format.nestLike(appName + (instanceId !== undefined ? `: #${instanceId}` : ''), {
                colors: true,
                prettyPrint: true,
                processId: false,
                appName: true,
            }),
        ),
        level: isDevelopment() ? 'debug' : 'http',
    });
}