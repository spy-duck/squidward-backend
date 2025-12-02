import requestIp from 'request-ip';
import { Request } from 'express';
import morgan from 'morgan';


morgan.token('remote-addr', (req: { clientIp: string } & Request) => {
    return req.clientIp;
});

export const getRealIpMiddleware = requestIp.mw;