import { Body, Controller, HttpStatus, Param, UseGuards } from '@nestjs/common';

import {
    ConfigCreateContract,
    ConfigsListContract,
    ConfigUpdateContract,
    ConfigRemoveContract,
    ConfigGetOneContract,
} from '@contract/commands';
import { RolesGuard } from '@/common/guards/roles /roles.guard';
import { Endpoint } from '@/common/decorators/endpoint';
import { errorHandler } from '@/common/helpers';
import { JwtGuard } from '@/common/guards/jwt';

import {
    ConfigCreateRequestDto, ConfigCreateResponseDto,
    ConfigRemoveRequestDto, ConfigRemoveResponseDto, ConfigsListResponseDto, ConfigUpdateRequestDto,
    ConfigUpdateResponseDto, ConfigGetOneRequestDto, ConfigGetOneResponseDto,
} from './dto';
import { ConfigsService } from './configs.service';

@UseGuards(JwtGuard, RolesGuard)
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