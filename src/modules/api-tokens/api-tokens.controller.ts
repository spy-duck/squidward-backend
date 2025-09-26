import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    ApiTokenCreateContract, ApiTokenRemoveContract, ApiTokensListContract,
} from '@contract/commands';
import { Endpoint } from '@/common/decorators/endpoint';
import { API_TOKENS_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import {
    ApiTokenCreateRequestDto, ApiTokenCreateResponseDto,
    ApiTokenRemoveRequestDto, ApiTokenRemoveResponseDto,
    ApiTokensListResponseDto,
} from './dto';
import { ApiTokensService } from './api-tokens.service';

@ApiBearerAuth('Authorization')
@ApiTags(API_TOKENS_CONTROLLER_INFO.tag)
@Roles(ROLE.ADMIN)
@Controller()
export class ApiTokensController {
    constructor(
        private readonly apiTokensService: ApiTokensService,
    ) {}
    
    @ApiResponse({ type: ApiTokenCreateResponseDto, description: 'Api token created successfully.' })
    @Endpoint({
        command: ApiTokenCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: ApiTokenCreateRequestDto,
    })
    async createApiToken(@Body() body: ApiTokenCreateRequestDto): Promise<ApiTokenCreateResponseDto> {
        const response = await this.apiTokensService.createApiToken(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: ApiTokenRemoveResponseDto, description: 'API token removed successfully.' })
    @Endpoint({
        command: ApiTokenRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeApiToken(@Param() body: ApiTokenRemoveRequestDto): Promise<ApiTokenRemoveResponseDto> {
        const response = await this.apiTokensService.removeApiToken(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: ApiTokensListResponseDto, description: 'Api tokens fetched successfully.' })
    @Endpoint({
        command: ApiTokensListContract,
        httpCode: HttpStatus.OK,
    })
    async apiTokensList(): Promise<ApiTokensListResponseDto> {
        const response = await this.apiTokensService.apiTokensList();
        return { response: errorHandler(response) };
    }
}