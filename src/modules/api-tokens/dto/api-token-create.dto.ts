import { createZodDto } from 'nestjs-zod';

import { ApiTokenCreateContract } from '@contract/commands';


export class ApiTokenCreateRequestDto extends createZodDto(ApiTokenCreateContract.RequestSchema) {}
export class ApiTokenCreateResponseDto extends createZodDto(ApiTokenCreateContract.ResponseSchema) {}