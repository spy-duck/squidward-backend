import { createZodDto } from 'nestjs-zod';

import { AuthCheckContract } from '@contract/commands';


export class AuthCheckResponseDto extends createZodDto(AuthCheckContract.ResponseSchema) {}