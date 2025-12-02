import { NextFunction, Request, Response } from 'express';

export function noRabotsMiddleware(req: Request, res: Response, next: NextFunction) {
    res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    
    return next();
}