import { Body, Controller, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ContextUser } from '@/common/decorators/context-user.decorator';
import { AdminChangeCredentialsContract } from '@contract/commands';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';
import { Endpoint } from '@/common/decorators/endpoint';
import { ADMIN_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import { AdminChangeCredentialsRequestDto, AdminChangeCredentialsResponseDto } from './dto';
import { AdminService } from './admin.service';

@ApiBearerAuth('Authorization')
@ApiTags(ADMIN_CONTROLLER_INFO.tag, 'Something')
@Roles(ROLE.ADMIN)
@Controller()
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {}

     @Endpoint({
        command: AdminChangeCredentialsContract,
        httpCode: HttpStatus.CREATED,
    })
    async changeCredentials(
        @ContextUser() contextUser: IJWTAuthPayload,
        @Body() body: AdminChangeCredentialsRequestDto
    ): Promise<AdminChangeCredentialsResponseDto> {
        const response = await this.adminService.changeCredentials({
            adminUuid: contextUser.uuid,
            username: body.username,
            password: body.password,
        });
        return errorHandler(response);
    }
}