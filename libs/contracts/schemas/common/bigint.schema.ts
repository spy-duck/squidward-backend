import { z } from 'zod';

export const bigintSchema = z.codec(
    z.string(),
    z.bigint(),
    {
        decode: (v) => BigInt(v),
        encode: (v) => v.toString(),
    }
);