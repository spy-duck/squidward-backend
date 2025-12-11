import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthLoginInterface } from '@/modules/auth/interfaces/auth-login.interface';
import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';
import { ERRORS, ROLE } from '@contract/constants';
import { comparePassword } from '@/common/helpers';
import { ICommandResponse } from '@/common/types';

import { AuthCheckResponseModel, AuthLoginResponseModel } from './models';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private readonly jwtLifetime: number;
    
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly adminRepository: AdminRepository,
    ) {
        this.jwtLifetime = this.configService.getOrThrow<number>('JWT_AUTH_LIFETIME');
    }
    
    async check(contextUser: IJWTAuthPayload): Promise<ICommandResponse<AuthCheckResponseModel>> {
        try {
            const admin = await this.adminRepository.getByUuid(contextUser.uuid!);
            if (!admin) {
                return {
                    success: false,
                    code: ERRORS.UNAUTHORIZED.code,
                    response: new AuthCheckResponseModel(false, ERRORS.UNAUTHORIZED.message),
                };
            }
            if (admin.role !== ROLE.ADMIN) {
                return {
                    success: false,
                    code: ERRORS.FORBIDDEN_ERROR.code,
                    response: new AuthCheckResponseModel(false, ERRORS.FORBIDDEN_ERROR.message),
                };
            }
            return {
                success: true,
                response: new AuthCheckResponseModel(
                    true,
                    null,
                    !admin.isInitialPasswordChanged,
                    this.configService.get('PANEL_VERSION')
                ),
            };
        } catch (error) {
            this.logger.error(error);
            let message = '';
            if (error instanceof Error) {
                message = error.message;
            }
            return {
                success: false,
                code: ERRORS.INTERNAL_SERVER_ERROR.code,
                response: new AuthCheckResponseModel(false, message),
            };
        }
    }
    
    async login(request: AuthLoginInterface): Promise<ICommandResponse<AuthLoginResponseModel>> {
        try {
            const admin = await this.adminRepository.getByUsername(request.login);
            
            if (!admin) {
                return {
                    success: false,
                    code: ERRORS.INVALID_CREDENTIALS.code,
                    response: new AuthLoginResponseModel(false, ERRORS.INVALID_CREDENTIALS.message),
                };
            }
            
            if (!await comparePassword(request.password, admin.passwordHash)) {
                return {
                    success: false,
                    code: ERRORS.INVALID_CREDENTIALS.code,
                    response: new AuthLoginResponseModel(false, ERRORS.INVALID_CREDENTIALS.message),
                };
            }
            
            const accessToken = this.jwtService.sign(
                {
                    username: admin.username,
                    uuid: admin.uuid,
                    role: ROLE.ADMIN,
                },
                {
                    expiresIn: `${ this.jwtLifetime }h`,
                },
            );
            return {
                success: true,
                response: new AuthLoginResponseModel(true, null, accessToken),
            };
        } catch (error) {
            this.logger.error(error);
            let message = '';
            if (error instanceof Error) {
                message = error.message;
            }
            return {
                success: false,
                code: ERRORS.INTERNAL_SERVER_ERROR.code,
                response: new AuthLoginResponseModel(false, message),
            };
        }
    }
}