import { ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { CLIENT_TYPE_BROWSER, CLIENT_TYPE_HEADER, ROLE } from '@contract/constants';
import { SKIP_JWT_GUARD } from '@/common/decorators/skip-jwt-guard';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';


@Injectable()
export class JwtGuard extends AuthGuard('squidward-jwt-guard') {
    constructor(
        private reflector: Reflector,
    ) {
        super();
    }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isJwtGuardSkip = this.reflector.getAllAndOverride<boolean>(SKIP_JWT_GUARD, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (isJwtGuardSkip) {
            return true;
        }
        
        const isJwtValid = await super.canActivate(context);
        
        if (!isJwtValid) {
            return false;
        }
        
        const request = context.switchToHttp().getRequest<{ user?: IJWTAuthPayload } & Request>();
        
        const { user } = request;
        
        if (!user || !user.role || !user.uuid) {
            return false;
        }
        
        if (user.role === ROLE.ADMIN) {
            const headers = request.headers;
            
            const clientType = headers[CLIENT_TYPE_HEADER.toLowerCase()];
            
            if (clientType !== CLIENT_TYPE_BROWSER) {
                throw new ForbiddenException(
                    'For API requests you must create own API-token in the admin dashboard.',
                );
            }
        }
        
        return true;
    }
}
