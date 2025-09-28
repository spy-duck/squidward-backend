import { z } from 'zod';

export const HostSchema = z.object({
    uuid: z
        .uuid()
        .describe('Unique identifier'),
    
    name: z
        .string()
        .trim()
        .min(2, 'Min. 2 characters')
        .default('Host display name'),
    
    url: z
        .string()
        .trim()
        .regex(z.regexes.domain)
        .or(z.ipv4().trim())
        .default('Host url'),
    
    countryCode: z
        .string()
        .trim()
        .length(2, 'Must be 2 characters')
        .default('Host country ISO 2 characters code'),
    
    nodeId: z
        .uuid()
        .nonempty()
        .describe('Node identifier'),
    
    enabled: z
        .boolean()
        .describe('Host enabled state'),
    
    createdAt: z
        .iso
        .datetime()
        .transform((v) => new Date(v))
        .pipe(z.date())
        .optional()
        .describe('Token creation date'),
    
    updatedAt: z
        .iso
        .datetime()
        .transform((v) => new Date(v))
        .pipe(z.date())
        .optional()
        .describe('Token last update date'),
})
    .describe('Base host');

export type THost = z.infer<typeof HostSchema>;