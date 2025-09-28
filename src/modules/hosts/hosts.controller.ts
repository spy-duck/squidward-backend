import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param } from '@nestjs/common';

import {
    HostCreateContract, HostRemoveContract, HostsListContract, HostUpdateContract,
} from '@contract/commands';
import { HostUpdateRequestDto, HostUpdateResponseDto } from '@/modules/hosts/dto/host-update.dto';
import { Endpoint } from '@/common/decorators/endpoint';
import { HOSTS_CONTROLLER_INFO } from '@contract/api';
import { Roles } from '@/common/decorators/roles';
import { errorHandler } from '@/common/helpers';
import { ROLE } from '@contract/constants';

import {
    HostCreateRequestDto, HostCreateResponseDto,
    HostRemoveRequestDto, HostRemoveResponseDto,
    HostsListResponseDto,
} from './dto';
import { HostsService } from './hosts.service';

@ApiBearerAuth('Authorization')
@ApiTags(HOSTS_CONTROLLER_INFO.tag)
@Roles(ROLE.ADMIN, ROLE.API)
@Controller()
export class HostsController {
    constructor(
        private readonly hostsService: HostsService,
    ) {}
    
    @ApiResponse({ type: HostCreateResponseDto, description: 'Host created successfully.' })
    @Endpoint({
        command: HostCreateContract,
        httpCode: HttpStatus.CREATED,
        apiBody: HostCreateRequestDto,
    })
    async createHost(@Body() body: HostCreateRequestDto): Promise<HostCreateResponseDto> {
        const response = await this.hostsService.createHost(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: HostCreateResponseDto, description: 'Host created successfully.' })
    @Endpoint({
        command: HostUpdateContract,
        httpCode: HttpStatus.OK,
        apiBody: HostCreateRequestDto,
    })
    async updateHost(@Body() body: HostUpdateRequestDto): Promise<HostUpdateResponseDto> {
        const response = await this.hostsService.updateHost(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: HostRemoveResponseDto, description: 'Host removed successfully.' })
    @Endpoint({
        command: HostRemoveContract,
        httpCode: HttpStatus.OK,
    })
    async removeHost(@Param() body: HostRemoveRequestDto): Promise<HostRemoveResponseDto> {
        const response = await this.hostsService.removeHost(body);
        return { response: errorHandler(response) };
    }
    
    @ApiResponse({ type: HostsListResponseDto, description: 'Hosts fetched successfully.' })
    @Endpoint({
        command: HostsListContract,
        httpCode: HttpStatus.OK,
    })
    async hostsList(): Promise<HostsListResponseDto> {
        const response = await this.hostsService.hostsList();
        return { response: errorHandler(response) };
    }
}