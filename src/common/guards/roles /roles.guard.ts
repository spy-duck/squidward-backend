import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SKIP_ROLES_GUARD } from '@/common/decorators/skip-roles-guard';
import { HttpExceptionWithErrorCodeType } from '@/common/exceptions';
import { ERRORS, ROLE, TRole } from '@contract/constants';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    canActivate(context: ExecutionContext): boolean {
        const isRolesGuardSkip = this.reflector.getAllAndOverride<boolean>(SKIP_ROLES_GUARD, [
            context.getHandler(),
            context.getClass(),
        ]);
        
        if (isRolesGuardSkip) {
            return true;
        }
        
        const requiredRoles = this.reflector.getAllAndOverride<TRole[]>(ROLE, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return false;
        }
        
        const { user } = context.switchToHttp().getRequest();
        
        const hasRole = requiredRoles.some((role) => user.role?.includes(role));
        
        if (!hasRole) {
            throw new HttpExceptionWithErrorCodeType(
                ERRORS.FORBIDDEN_ROLE_ERROR.message,
                ERRORS.FORBIDDEN_ROLE_ERROR.code,
                ERRORS.FORBIDDEN_ROLE_ERROR.httpCode,
            );
        }
        return hasRole;
    }
}