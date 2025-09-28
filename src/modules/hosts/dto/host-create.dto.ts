import { createZodDto } from 'nestjs-zod';

import { HostCreateContract } from '@contract/commands';


export class HostCreateRequestDto extends createZodDto(HostCreateContract.RequestSchema) {}
export class HostCreateResponseDto extends createZodDto(HostCreateContract.ResponseSchema) {}