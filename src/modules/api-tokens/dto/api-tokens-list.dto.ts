import { createZodDto } from 'nestjs-zod';

import { ApiTokensListContract } from '@contract/commands';


export class ApiTokensListRequestDto extends createZodDto(ApiTokensListContract.RequestSchema) {}
export class ApiTokensListResponseDto extends createZodDto(ApiTokensListContract.ResponseSchema) {}