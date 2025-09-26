import { createZodDto } from 'nestjs-zod';

import { ApiTokenRemoveContract } from '@contract/commands';


export class ApiTokenRemoveRequestDto extends createZodDto(ApiTokenRemoveContract.RequestSchema) {}
export class ApiTokenRemoveResponseDto extends createZodDto(ApiTokenRemoveContract.ResponseSchema) {}