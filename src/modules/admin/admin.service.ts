import { Injectable, Logger } from '@nestjs/common';

import { AdminRepository } from '@/modules/admin/repositories/admin.repository';
import { encryptPassword } from '@/common/helpers';
import { ICommandResponse } from '@/common/types';
import { ERRORS } from '@contract/constants';

import { AdminChangeCredentialsResponseModel } from './models';
import { AdminChangeCredentialsInterface } from './interfaces';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    
    constructor(
        private readonly adminRepository: AdminRepository,
    ) {}
  
    async changeCredentials(request: AdminChangeCredentialsInterface): Promise<ICommandResponse<AdminChangeCredentialsResponseModel>> {
        try {
            if (!request.adminUuid) {
                return {
                    success: false,
                    code: ERRORS.FORBIDDEN_ERROR.code,
                    response: new AdminChangeCredentialsResponseModel(false, ERRORS.FORBIDDEN_ERROR.message),
                };
            }
            
            if (request.username === 'squidward') {
                return {
                    success: false,
                    code: ERRORS.ADMIN_FORBIDDEN_CREDENTIALS_ERROR.code,
                    response: new AdminChangeCredentialsResponseModel(false, ERRORS.ADMIN_FORBIDDEN_CREDENTIALS_ERROR.message),
                };
            }
            
            const admin = await this.adminRepository.getByUuid(request.adminUuid);
            
            if (!admin || admin.isInitialPasswordChanged) {
                return {
                    success: false,
                    code: ERRORS.FORBIDDEN_ERROR.code,
                    response: new AdminChangeCredentialsResponseModel(false, ERRORS.FORBIDDEN_ERROR.message),
                };
            }
            
            await this.adminRepository.changeCredentials({
                ...admin,
                username: request.username,
                passwordHash: await encryptPassword(request.password),
                isInitialPasswordChanged: true,
            });
            
            return {
                success: true,
                response: new AdminChangeCredentialsResponseModel(true, null),
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
                response: new AdminChangeCredentialsResponseModel(false, message),
            };
        }
    }
}