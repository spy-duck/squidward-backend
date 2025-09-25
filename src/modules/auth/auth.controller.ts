import { ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, HttpStatus } from '@nestjs/common';

import { AuthCheckContract, AuthLoginContract } from '@contract/commands';
import { SkipRolesGuard } from '@/common/decorators/skip-roles-guard';
import { SkipJwtGuard } from '@/common/decorators/skip-jwt-guard';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';

import { AuthCheckResponseDto, AuthLoginRequestDto, AuthLoginResponseDto } from './dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
    
    @Endpoint({
        command: AuthCheckContract,
        httpCode: HttpStatus.OK,
    })
    @SkipRolesGuard()
    async checkAuth(): Promise<AuthCheckResponseDto> {
        const response = await this.authService.check();
        return errorHandler(response);
    }
    
    @ApiResponse({ type: AuthLoginRequestDto, description: 'Access token for further requests' })
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