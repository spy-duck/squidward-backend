import { createZodDto } from 'nestjs-zod';

import { AuthLoginContract } from '@contract/commands';


export class AuthLoginRequestDto extends createZodDto(AuthLoginContract.RequestSchema) {}
export class AuthLoginResponseDto extends createZodDto(AuthLoginContract.ResponseSchema) {}