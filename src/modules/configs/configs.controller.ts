import { Body, Controller, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
    ConfigCreateContract,
    ConfigsListContract,
    ConfigUpdateContract,
    ConfigRemoveContract,
    ConfigGetOneContract,
} from '@contract/commands';
import {  CONFIGS_CONTROLLER_INFO } from '@contract/api';
import { Endpoint } from '@/common/decorators/endpoint';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import {
    ConfigCreateRequestDto, ConfigCreateResponseDto,
    ConfigRemoveRequestDto, ConfigRemoveResponseDto, ConfigsListResponseDto, ConfigUpdateRequestDto,
    ConfigUpdateResponseDto, ConfigGetOneRequestDto, ConfigGetOneResponseDto,
} from './dto';
import { ConfigsService } from './configs.service';

@ApiBearerAuth('Authorization')
@ApiTags(CONFIGS_CONTROLLER_INFO.tag)
@Roles(ROLE.ADMIN, ROLE.API)
@Controller()
export class ConfigsController {
    constructor(
        private readonly configsService: ConfigsService,
    ) {}
    
    @Endpoint({
        command: ConfigCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: ConfigCreateRequestDto,
    })
    async createConfig(@Body() body: ConfigCreateRequestDto): Promise<ConfigCreateResponseDto> {
        const response = await this.configsService.createConfig(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: ConfigsListContract,
        httpCode: HttpStatus.OK,
    })
    async configsList(): Promise<ConfigsListResponseDto> {
        const response = await this.configsService.usersList();
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: ConfigUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: ConfigUpdateRequestDto,
    })
    async updateConfig(@Body() body: ConfigUpdateRequestDto): Promise<ConfigUpdateResponseDto> {
        const response = await this.configsService.updateUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: ConfigRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeConfig(@Param() body: ConfigRemoveRequestDto): Promise<ConfigRemoveResponseDto> {
        const response = await this.configsService.removeUser(body);
        return { response: errorHandler(response) };
    }
    
    @Endpoint({
        command: ConfigGetOneContract,
        httpCode: HttpStatus.OK,
    })
    async getOneConfig(@Param() body: ConfigGetOneRequestDto): Promise<ConfigGetOneResponseDto> {
        const response = await this.configsService.getOneConfig(body);
        return { response: errorHandler(response) };
    }
}