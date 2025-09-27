import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus } from '@nestjs/common';

import { AuthCheckContract, AuthLoginContract } from '@contract/commands';
import { ContextUser } from '@/common/decorators/context-user.decorator';
import { SkipRolesGuard } from '@/common/decorators/skip-roles-guard';
import { SkipJwtGuard } from '@/common/decorators/skip-jwt-guard';
import { IJWTAuthPayload } from '@/modules/auth/interfaces';
import { Endpoint } from '@/common/decorators/endpoint';
import { AUTH_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import { AuthCheckResponseDto, AuthLoginRequestDto, AuthLoginResponseDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags(AUTH_CONTROLLER_INFO.tag)
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @ApiBearerAuth('Authorization')
    @ApiResponse({ type: AuthCheckResponseDto, description: 'Success check' })
    @Endpoint({
        command: AuthCheckContract,
        httpCode: HttpStatus.OK,
    })
    @Roles(ROLE.ADMIN)
    async checkAuth(@ContextUser() contextUser: IJWTAuthPayload): Promise<AuthCheckResponseDto> {
        const response = await this.authService.check(contextUser);
        return errorHandler(response);
    }
    
    @ApiResponse({ type: AuthLoginResponseDto, description: 'Access token for further requests' })
    @Endpoint({
        command: AuthLoginContract,
        httpCode: HttpStatus.OK,
    })
    @SkipJwtGuard()
    @SkipRolesGuard()
    async login(@Body() body: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
        const response = await this.authService.login(body);
        return errorHandler(response);
    }
}