import { createZodDto } from 'nestjs-zod';

import { HostUpdateContract } from '@contract/commands';


export class HostUpdateRequestDto extends createZodDto(HostUpdateContract.RequestSchema) {}
export class HostUpdateResponseDto extends createZodDto(HostUpdateContract.ResponseSchema) {}