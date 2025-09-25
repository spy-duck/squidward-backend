import { Body, Controller, HttpStatus, UseGuards } from '@nestjs/common';

import { AuthCheckContract, AuthLoginContract } from '@contract/commands';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';
import { JwtGuard } from '@/common/guards/jwt';

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
    @UseGuards(JwtGuard)
    async checkAuth(): Promise<AuthCheckResponseDto> {
        const response = await this.authService.check();
        return errorHandler(response);
    }
    
    @Endpoint({
        command: AuthLoginContract,
        httpCode: HttpStatus.OK,
    })
    async login(@Body() body: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
        const response = await this.authService.login(body);
        return errorHandler(response);
    }
}