import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { ApiRepository } from '@/modules/api/repositories/api.repository';
import { AdminEntity } from '@/modules/admin/entities/admin.entity';
import { ApiEntity } from '@/modules/api/entities/api.entity';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';
import { ROLE } from '@contract/constants';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'squidward-jwt-guard') {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        configService: ConfigService,
        private readonly adminRepository: AdminRepository,
        private readonly apiRepository: ApiRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_AUTH_SECRET'),
        });
    }
    
    async validate(payload: IJWTAuthPayload): Promise<IJWTAuthPayload | null> {
        if (!payload.uuid) {
            return null;
        }
        
        switch (payload.role) {
            case ROLE.API: {
                return await this.verifyApiToken(payload.uuid) ? payload : null;
            }
            
            case ROLE.ADMIN: {
                if (!payload.username) {
                    return null;
                }
                
                const adminEntity = await this.getAdminByUsername(payload.username);
                
                if (!adminEntity) {
                    return null;
                }
                
                return adminEntity.uuid === payload.uuid ? payload : null;
            }
            default:
                return null;
        }
        
    }
    
    private async getAdminByUsername(username: string): Promise<AdminEntity | null> {
        return this.adminRepository.getByUsername(username);
    }
    
    private async getTokenByUuid(apiTokenUuid: string): Promise<ApiEntity | null> {
        return this.apiRepository.getByUuid(apiTokenUuid);
    }
    
    private async verifyApiToken(apiTokenUuid: string): Promise<boolean> {
        const cached = await this.cacheManager.get<string>(`api:${apiTokenUuid}`);
        if (cached) {
            return true;
        }
        
        const token = await this.getTokenByUuid(apiTokenUuid);
        if (!token) {
            return false;
        }
        
        await this.cacheManager.set(`api:${apiTokenUuid}`, '1', 3_600_000);
        return true;
    }
}
