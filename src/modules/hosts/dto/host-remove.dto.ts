import { createZodDto } from 'nestjs-zod';

import { HostRemoveContract } from '@contract/commands';


export class HostRemoveRequestDto extends createZodDto(HostRemoveContract.RequestSchema) {}
export class HostRemoveResponseDto extends createZodDto(HostRemoveContract.ResponseSchema) {}