import { createZodDto } from 'nestjs-zod';

import { HostsListContract } from '@contract/commands';


export class HostsListRequestDto extends createZodDto(HostsListContract.RequestSchema) {}
export class HostsListResponseDto extends createZodDto(HostsListContract.ResponseSchema) {}