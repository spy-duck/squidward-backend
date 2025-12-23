import { z } from 'zod';

import { bigintSchema } from './bigint.schema';

export const metricsSchema = z.object({
    upload: bigintSchema,
    download: bigintSchema,
    total: bigintSchema,
});

export type TMetrics = z.infer<typeof metricsSchema>;