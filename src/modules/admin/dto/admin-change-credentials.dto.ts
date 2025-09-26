import { createZodDto } from 'nestjs-zod';

import { AdminChangeCredentialsContract } from '@contract/commands';


export class AdminChangeCredentialsRequestDto extends createZodDto(AdminChangeCredentialsContract.RequestSchema) {}
export class AdminChangeCredentialsResponseDto extends createZodDto(AdminChangeCredentialsContract.ResponseSchema) {}