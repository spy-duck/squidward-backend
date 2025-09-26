import { ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpStatus } from '@nestjs/common';

import { ContextUser } from '@/common/decorators/context-user.decorator';
import { AdminChangeCredentialsContract } from '@contract/commands';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';
import { Endpoint } from '@/common/decorators/endpoint';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import { AdminChangeCredentialsRequestDto, AdminChangeCredentialsResponseDto } from './dto';
import { AdminService } from './admin.service';

@Roles(ROLE.ADMIN)
@Controller()
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) {}

    @ApiResponse({ type: AdminChangeCredentialsRequestDto, description: 'Access token for further requests' })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized - Invalid credentials',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Invalid credentials' },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
    })
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